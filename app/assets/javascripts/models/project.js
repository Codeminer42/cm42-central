import Cookies from 'js-cookie';
import StoryCollection from '../collections/story_collection';
import UserCollection from '../collections/user_collection';
import Iteration from '../models/iteration';
import ProjectBoard from '../models/projectBoard';

const Project = Backbone.Model.extend(
  {
    defaults: {
      default_velocity: 10,
    },

    name: 'project',

    initialize: function (args) {
      this.maybeUnwrap(args);

      _.bindAll(this, 'updateChangesets');

      this.on('change:last_changeset_id', this.updateChangesets, this);

      this.projectBoard = new ProjectBoard({ project: this });
      this.projectBoard.stories.url = `${this.url()}/stories`;

      this.users = new UserCollection();
      this.users.url = `${this.url()}/users`;
      this.users.project = this;

      this.search = new StoryCollection();
      this.search.url = `${this.url()}/stories`;
      this.search.project = this;

      this.iterations = [];
    },

    url: function () {
      return '/projects/' + this.id;
    },

    // The ids of the columns, in the order that they appear by story weight
    columnIds: [
      '#done',
      '#in_progress',
      '#backlog',
      '#chilly_bin',
      '#search_results',
      '#epic',
    ],

    // Return an array of the columns that appear after column, or an empty
    // array if the column is the last
    columnsAfter: function (column) {
      var index = _.indexOf(this.columnIds, column);
      if (index === -1) {
        // column was not found in the array
        throw column.toString() + ' is not a valid column';
      }
      return this.columnIds.slice(index + 1);
    },

    // Return an array of the columns that appear before column, or an empty
    // array if the column is the first
    columnsBefore: function (column) {
      var index = _.indexOf(this.columnIds, column);
      if (index === -1) {
        // column was not found in the array
        throw column.toString() + ' is not a valid column';
      }
      return this.columnIds.slice(0, index);
    },

    // This method is triggered when the last_changeset_id attribute is changed,
    // which indicates there are changed or new stories on the server which need
    // to be loaded.
    updateChangesets: function () {
      var from = this.previous('last_changeset_id');
      if (_.isNull(from)) {
        from = 0;
      }
      var to = this.get('last_changeset_id');
      if (_.isNull(to)) {
        to = 0;
      }

      var model = this;
      var options = {
        type: 'GET',
        dataType: 'json',
        success: function (resp) {
          model.handleChangesets(resp);
        },
        data: { from: from, to: to },
        url: this.url() + '/changesets',
      };

      $.ajax(options);
    },

    // (Re)load each of the stories described in the provided changesets.
    handleChangesets: function (changesets) {
      var that = this;

      var story_ids = _.map(changesets, function (changeset) {
        return changeset.changeset.story_id;
      });
      story_ids = _.uniq(story_ids);

      _.each(story_ids, function (story_id) {
        // FIXME - Feature envy on stories collection
        var story = that.projectBoard.stories.get(story_id);
        if (story) {
          // This is an existing story on the collection, just reload it
          story.fetch();
        } else {
          // This is a new story, which is present on the server but we don't
          // have it locally yet.
          that.projectBoard.stories.add({ id: story_id });
          story = that.projectBoard.stories.get(story_id);
          story.fetch();
        }
      });
    },

    milliseconds_in_a_day: 1000 * 60 * 60 * 24,

    // Return the correct iteration number for a given date.
    getIterationNumberForDate: function (compare_date) {
      //var start_date = new Date(this.get('start_date'));
      var start_date = this.startDate();
      var difference = Math.abs(compare_date.getTime() - start_date.getTime());
      var days_apart = Math.round(difference / this.milliseconds_in_a_day);
      var days_in_iteration = this.get('iteration_length') * 7;
      var iteration_number = Math.floor(days_apart / days_in_iteration + 1);

      return iteration_number;
    },

    getDateForIterationNumber: function (iteration_number) {
      // The difference betweeen the start date in days.  Iteration length is
      // in weeks.
      var difference =
        7 * this.get('iteration_length') * (iteration_number - 1);
      var start_date = this.startDate();
      var iteration_date = new Date(start_date);

      iteration_date.setDate(start_date.getDate() + difference);
      return iteration_date;
    },

    currentIterationNumber: function () {
      return this.getIterationNumberForDate(this.today());
    },

    today: function () {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    },

    startDate: function () {
      var start_date;
      if (this.get('start_date')) {
        // Parse the date string into an array of [YYYY, MM, DD] to
        // ensure identical date behaviour across browsers.
        var dateArray = this.get('start_date').split('/');
        var year = parseInt(dateArray[0], 10);
        // Month is zero indexed
        var month = parseInt(dateArray[1], 10) - 1;
        var day = parseInt(dateArray[2], 10);

        start_date = new Date(year, month, day);
      } else {
        start_date = this.today();
      }

      // Is the specified project start date the same week day as the iteration
      // start day?
      if (start_date.getDay() === this.get('iteration_start_day')) {
        return start_date;
      } else {
        // Calculate the date of the nearest prior iteration start day to the
        // specified project start date.  So if the iteration start day is
        // set to Monday, but the project start date is set to a specific
        // Thursday, return the Monday before the Thursday.  A greater
        // mathemtician than I could probably do this with the modulo.
        var day_difference =
          start_date.getDay() - this.get('iteration_start_day');

        // The iteration start day is after the project start date, in terms of
        // day number
        if (day_difference < 0) {
          day_difference = day_difference + 7;
        }
        return new Date(
          start_date - day_difference * this.milliseconds_in_a_day
        );
      }
    },

    // Override the calculated velocity with a user defined value.  If this
    // value is different to the calculated velocity, the velocityIsFake
    // attribute will be set to true.
    velocity: function (userVelocity) {
      if (!_.isUndefined(userVelocity)) {
        if (userVelocity < 1) {
          userVelocity = 1;
        }

        if (userVelocity === this.calculateVelocity()) {
          this.unset('userVelocity');
        } else {
          this.set({ userVelocity: userVelocity });
        }
      }
      if (this.get('userVelocity')) {
        return this.get('userVelocity');
      } else {
        return this.calculateVelocity();
      }
    },

    velocityIsFake: function () {
      return !_.isUndefined(this.get('userVelocity'));
    },

    calculateVelocity: function () {
      if (this.doneIterations().length === 0) {
        return this.get('default_velocity');
      } else {
        // TODO Make number of iterations configurable
        var numIterations = 3;
        var doneIterations = this.doneIterations();
        var iterations = _.last(doneIterations, numIterations);

        var velocity = 1;
        var pointsArray = _.invoke(iterations, 'points');

        if (pointsArray.length > 0) {
          var sum = _.reduce(
            pointsArray,
            function (memo, points) {
              return memo + points;
            },
            0
          );

          velocity = Math.floor(sum / pointsArray.length);
        }

        return velocity < 1 ? 1 : velocity;
      }
    },

    revertVelocity: function () {
      this.unset('userVelocity');
    },

    doneIterations: function () {
      return _.select(this.iterations, function (iteration) {
        return iteration.get('column') === '#done';
      });
    },

    rebuildIterations: function () {
      //
      // Done column
      //
      var that = this;

      // Clear the project iterations
      this.iterations = [];

      // Reset all story column values.  Required as the story.column values
      // may have been changed from their default values by a prior run of
      // this method.
      this.projectBoard.stories.invoke('setColumn');

      this.projectBoard.pastIterations.forEach(iteration => {
        that.appendIteration(iteration, '#done');
      });

      var currentIteration = new Iteration({
        number: this.currentIterationNumber(),
        stories: this.projectBoard.stories.column('#in_progress'),
        maximum_points: this.velocity(),
        column: '#in_progress',
      });
      this.appendIteration(currentIteration, '#done');

      //
      // Backlog column
      //
      var backlogIteration = new Iteration({
        number: currentIteration.get('number') + 1,
        column: '#backlog',
        maximum_points: this.velocity(),
      });
      this.appendIteration(backlogIteration, '#backlog');

      _.each(this.projectBoard.stories.column('#backlog'), function (story) {
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
          var nextNumber =
            backlogIteration.get('number') +
            1 +
            Math.ceil(backlogIteration.overflowsBy() / that.velocity());

          backlogIteration = new Iteration({
            number: nextNumber,
            column: '#backlog',
            maximum_points: that.velocity(),
          });

          that.appendIteration(backlogIteration, '#backlog');
        }

        backlogIteration.get('stories').push(story);
      });

      _.each(this.iterations, function (iteration) {
        iteration.project = that;
      });

      this.trigger('rebuilt-iterations');
    },

    // Adds an iteration to the project.  Creates empty iterations to fill any
    // gaps between the iteration number and the last iteration number added.
    appendIteration: function (iteration, columnForMissingIterations) {
      var lastIteration = _.last(this.iterations);

      // If there is a gap between the last iteration and this one, fill
      // the gap with empty iterations
      this.iterations = this.iterations.concat(
        Iteration.createMissingIterations(
          columnForMissingIterations,
          lastIteration,
          iteration
        )
      );

      this.iterations.push(iteration);
    },

    toggleStoryFlow: function () {
      var defaultFlow = this.get('default_flow');
      var nextValue =
        this.get('current_flow') === defaultFlow
          ? 'progress_to_right' // alternative story flow
          : defaultFlow;

      this.set('current_flow', nextValue);
      Cookies.set('current_flow', nextValue, { expires: 365 });
    },
  },
  {
    filters: ['not_archived', 'archived', 'all_projects'],
  }
);

export default Project;
