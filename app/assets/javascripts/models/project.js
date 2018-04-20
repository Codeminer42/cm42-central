/* eslint camelcase:"off" */
/* eslint no-throw-literal:"off" */
/* eslint no-mixed-operators:"off" */
/* eslint no-param-reassign:"off" */
/* eslint max-len:"off" */
const Cookies = require('js-cookie');

const StoryCollection = require('collections/story_collection');
const UserCollection = require('collections/user_collection');
const Iteration = require('models/iteration');

module.exports = Backbone.Model.extend({
  defaults: {
    default_velocity: 10,
  },

  name: 'project',

  initialize(args) {
    this.maybeUnwrap(args);

    _.bindAll(this, 'updateChangesets');

    this.on('change:last_changeset_id', this.updateChangesets, this);

    this.stories = new StoryCollection();
    this.stories.url = `${this.url()}/stories`;
    this.stories.project = this;

    this.users = new UserCollection();
    this.users.url = `${this.url()}/users`;
    this.users.project = this;

    this.search = new StoryCollection();
    this.search.url = `${this.url()}/stories`;
    this.search.project = this;

    this.iterations = [];
  },

  url() {
    return `/projects/${this.id}`;
  },

  // The ids of the columns, in the order that they appear by story weight
  columnIds: ['#done', '#in_progress', '#backlog', '#chilly_bin', '#search_results', '#epic'],

  // Return an array of the columns that appear after column, or an empty
  // array if the column is the last
  columnsAfter(column) {
    const index = _.indexOf(this.columnIds, column);
    if (index === -1) {
      // column was not found in the array
      throw `${column.toString()} is not a valid column`;
    }
    return this.columnIds.slice(index + 1);
  },

  // Return an array of the columns that appear before column, or an empty
  // array if the column is the first
  columnsBefore(column) {
    const index = _.indexOf(this.columnIds, column);
    if (index === -1) {
      // column was not found in the array
      throw `${column.toString()} is not a valid column`;
    }
    return this.columnIds.slice(0, index);
  },

  // This method is triggered when the last_changeset_id attribute is changed,
  // which indicates there are changed or new stories on the server which need
  // to be loaded.
  updateChangesets() {
    let from = this.previous('last_changeset_id');
    if (_.isNull(from)) {
      from = 0;
    }
    let to = this.get('last_changeset_id');
    if (_.isNull(to)) {
      to = 0;
    }

    const model = this;
    const options = {
      type: 'GET',
      dataType: 'json',
      success(resp) {
        model.handleChangesets(resp);
      },
      data: { from, to },
      url: `${this.url()}/changesets`,
    };

    $.ajax(options);
  },

  // (Re)load each of the stories described in the provided changesets.
  handleChangesets(changesets) {
    const that = this;

    let story_ids = _.map(changesets, changeset => changeset.changeset.story_id);
    story_ids = _.uniq(story_ids);

    _.each(story_ids, (story_id) => {
      // FIXME - Feature envy on stories collection
      let story = that.stories.get(story_id);
      if (story) {
        // This is an existing story on the collection, just reload it
        story.fetch();
      } else {
        // This is a new story, which is present on the server but we don't
        // have it locally yet.
        that.stories.add({ id: story_id });
        story = that.stories.get(story_id);
        story.fetch();
      }
    });
  },

  milliseconds_in_a_day: 1000 * 60 * 60 * 24,

  // Return the correct iteration number for a given date.
  getIterationNumberForDate(compare_date) {
    // var start_date = new Date(this.get('start_date'));
    const start_date = this.startDate();
    const difference = Math.abs(compare_date.getTime() - start_date.getTime());
    const days_apart = Math.round(difference / this.milliseconds_in_a_day);
    const days_in_iteration = this.get('iteration_length') * 7;
    const iteration_number = Math.floor((days_apart / days_in_iteration) + 1);

    return iteration_number;
  },

  getDateForIterationNumber(iteration_number) {
    // The difference betweeen the start date in days.  Iteration length is
    // in weeks.
    const difference = (7 * this.get('iteration_length')) * (iteration_number - 1);
    const start_date = this.startDate();
    const iteration_date = new Date(start_date);

    iteration_date.setDate(start_date.getDate() + difference);
    return iteration_date;
  },

  currentIterationNumber() {
    return this.getIterationNumberForDate(this.today());
  },

  today() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  },

  startDate() {
    let start_date;
    if (this.get('start_date')) {
      // Parse the date string into an array of [YYYY, MM, DD] to
      // ensure identical date behaviour across browsers.
      const dateArray = this.get('start_date').split('/');
      const year = parseInt(dateArray[0], 10);
      // Month is zero indexed
      const month = parseInt(dateArray[1], 10) - 1;
      const day = parseInt(dateArray[2], 10);

      start_date = new Date(year, month, day);
    } else {
      start_date = this.today();
    }

    // Is the specified project start date the same week day as the iteration
    // start day?
    if (start_date.getDay() === this.get('iteration_start_day')) {
      return start_date;
    }
    // Calculate the date of the nearest prior iteration start day to the
    // specified project start date.  So if the iteration start day is
    // set to Monday, but the project start date is set to a specific
    // Thursday, return the Monday before the Thursday.  A greater
    // mathemtician than I could probably do this with the modulo.
    let day_difference = start_date.getDay() - this.get('iteration_start_day');

    // The iteration start day is after the project start date, in terms of
    // day number
    if (day_difference < 0) {
      day_difference += 7;
    }
    return new Date(start_date - day_difference * this.milliseconds_in_a_day);
  },

  // Override the calculated velocity with a user defined value.  If this
  // value is different to the calculated velocity, the velocityIsFake
  // attribute will be set to true.
  velocity(userVelocity) {
    if (!_.isUndefined(userVelocity)) {
      if (userVelocity < 1) {
        userVelocity = 1;
      }

      if (userVelocity === this.calculateVelocity()) {
        this.unset('userVelocity');
      } else {
        this.set({ userVelocity });
      }
    }
    if (this.get('userVelocity')) {
      return this.get('userVelocity');
    }
    return this.calculateVelocity();
  },

  velocityIsFake() {
    return (!_.isUndefined(this.get('userVelocity')));
  },

  calculateVelocity() {
    if (this.doneIterations().length === 0) {
      return this.get('default_velocity');
    }
    // TODO Make number of iterations configurable
    const numIterations = 3;
    const doneIterations = this.doneIterations();
    const iterations = _.last(doneIterations, numIterations);

    let velocity = 1;
    const pointsArray = _.invoke(iterations, 'points');

    if (pointsArray.length > 0) {
      const sum = _.reduce(pointsArray, (memo, points) => memo + points, 0);

      velocity = Math.floor(sum / pointsArray.length);
    }

    return velocity < 1 ? 1 : velocity;
  },

  revertVelocity() {
    this.unset('userVelocity');
  },

  doneIterations() {
    return _.select(this.iterations, iteration => iteration.get('column') === '#done');
  },

  rebuildIterations() {
    //
    // Done column
    //
    const that = this;

    // Clear the project iterations
    this.iterations = [];

    // Reset all story column values.  Required as the story.column values
    // may have been changed from their default values by a prior run of
    // this method.
    this.stories.invoke('setColumn');

    const doneIterations = _.groupBy(
      this.stories.column('#done'),
      story => story.iterationNumber(),
    );

    // groupBy() returns an object with keys of the iteration number
    // and values of the stories array.  Ensure the keys are sorted
    // in numeric order.
    const doneNumbers = _.keys(doneIterations).sort((left, right) => (left - right));

    _.each(doneNumbers, (iterationNumber) => {
      const stories = doneIterations[iterationNumber];
      const iteration = new Iteration({
        number: iterationNumber, stories, column: '#done',
      });

      that.appendIteration(iteration, '#done');
    });

    const currentIteration = new Iteration({
      number: this.currentIterationNumber(),
      stories: this.stories.column('#in_progress'),
      maximum_points: this.velocity(),
      column: '#in_progress',
    });
    this.appendIteration(currentIteration, '#done');


    //
    // Backlog column
    //
    let backlogIteration = new Iteration({
      number: currentIteration.get('number') + 1,
      column: '#backlog',
      maximum_points: this.velocity(),
    });
    this.appendIteration(backlogIteration, '#backlog');


    _.each(this.stories.column('#backlog'), (story) => {
      // The in progress iteration usually needs to be filled with the first
      // few stories from the backlog, unless the points total of the stories
      // in progress already equal or exceed the project velocity
      if (currentIteration.canTakeStory(story)) {
        // On initialisation, a stories column is determined based on the
        // story state.  For unstarted stories this defaults to #backlog.
        // Stories matched here need this value overridden to #in_progress
        story.column = '#in_progress';

        currentIteration.get('stories').push(story);
        return;
      }

      if (!backlogIteration.canTakeStory(story)) {
        // Iterations sometimes 'overflow', i.e. an iteration may contain a
        // 5 point story but the project velocity is 1.  In this case, the
        // next iteration that can have a story added is the current + 4.
        const nextNumber = backlogIteration.get('number') + 1 + Math.ceil(backlogIteration.overflowsBy() / that.velocity());

        backlogIteration = new Iteration({
          number: nextNumber,
          column: '#backlog',
          maximum_points: that.velocity(),
        });

        that.appendIteration(backlogIteration, '#backlog');
      }

      backlogIteration.get('stories').push(story);
    });

    _.each(this.iterations, (iteration) => {
      iteration.project = that;
    });

    this.trigger('rebuilt-iterations');
  },

  // Adds an iteration to the project.  Creates empty iterations to fill any
  // gaps between the iteration number and the last iteration number added.
  appendIteration(iteration, columnForMissingIterations) {
    const lastIteration = _.last(this.iterations);

    // If there is a gap between the last iteration and this one, fill
    // the gap with empty iterations
    this.iterations = this.iterations.concat(Iteration.createMissingIterations(columnForMissingIterations, lastIteration, iteration));

    this.iterations.push(iteration);
  },

  toggleStoryFlow() {
    const defaultFlow = this.get('default_flow');
    const nextValue = (this.get('current_flow') === defaultFlow)
      ? 'progress_to_right' // alternative story flow
      : defaultFlow;

    this.set('current_flow', nextValue);
    Cookies.set('current_flow', nextValue, { expires: 365 });
  },
}, {
  filters: ['not_archived', 'archived', 'all_projects'],
});
