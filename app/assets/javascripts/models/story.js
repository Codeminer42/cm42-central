/* eslint no-multi-assign:"off" */
/* eslint default-case:"off" */
/* eslint camelcase:"off" */
/* eslint consistent-return:"off" */
/* eslint prefer-destructuring:"off" */
const ActivityCollection = require('collections/activity_collection');
const NoteCollection = require('collections/note_collection');
const TaskCollection = require('collections/task_collection');
const SharedModelMethods = require('mixins/shared_model_methods');

const Story = module.exports = Backbone.Model.extend({
  defaults: {
    events: [],
    documents: [],
    state: 'unscheduled',
    story_type: 'feature',
  },

  name: 'story',

  i18nScope: 'activerecord.attributes.story',

  timestampFormat: 'd mmm yyyy, h:MMtt',

  isReadonly: false,

  initialize(args) {
    _.bindAll(this, 'changeState', 'populateNotes', 'populateTasks');

    this.views = [];
    this.clickFromSearchResult = false;

    this.on('change:state', this.changeState, this);
    this.on('change:notes', this.populateNotes, this);
    this.on('change:tasks', this.populateTasks, this);

    // FIXME Call super()?
    this.maybeUnwrap(args);

    this.initHistory();
    this.initNotes();
    this.initTasks();
    this.setColumn();

    this.setReadonly();
  },

  setReadonly() {
    const accepted = this.get('state') === 'accepted' && this.get('accepted_at') !== undefined;
    const isGuest = (
      this.collection !== undefined &&
      this.collection.project.current_user !== undefined &&
      this.collection.project.current_user.get('guest?')
    );

    if (isGuest || accepted) {
      this.isReadonly = true;
    }
  },

  changeState(model, newValue) {
    if (newValue === 'started') {
      model.set({ owned_by_id: model.collection.project.current_user.id }, true);
    }

    model.setAcceptedAt();
    model.setColumn();
  },

  moveBetween(before, after) {
    const beforeStory = this.collection.get(before);
    const afterStory = this.collection.get(after);
    const difference = (afterStory.position() - beforeStory.position()) / 2;
    const newPosition = difference + beforeStory.position();
    this.set({ position: newPosition });
    this.collection.sort();
    return this;
  },

  moveAfter(beforeId) {
    const before = this.collection.get(beforeId);
    const after = this.collection.nextOnColumn(before);
    let afterPosition;
    if (typeof after === 'undefined') {
      afterPosition = before.position() + 2;
    } else {
      afterPosition = after.position();
    }
    const difference = (afterPosition - before.position()) / 2;
    const newPosition = difference + before.position();
    this.set({ position: newPosition });
    this.saveSorting();
    return this;
  },

  moveBefore(afterId) {
    const after = this.collection.get(afterId);
    const before = this.collection.previousOnColumn(after);
    let beforePosition;
    if (typeof before === 'undefined') {
      beforePosition = 0.0;
    } else {
      beforePosition = before.position();
    }
    const difference = (after.position() - beforePosition) / 2;
    const newPosition = difference + beforePosition;

    this.set({ position: newPosition });
    this.collection.sort({ silent: true });
    this.saveSorting();
    return this;
  },

  saveSorting() {
    this.save();
    this.collection.saveSorting(this.column);
  },

  setColumn() {
    let column = '#in_progress';

    switch (this.get('state')) {
      case 'unscheduled':
        column = '#chilly_bin';
        break;
      case 'unstarted':
        column = '#backlog';
        break;
      case 'accepted':
        // Accepted stories remain in the in progress column if they were
        // completed within the current iteration.
        if (this.collection.project.currentIterationNumber() === this.iterationNumber()) {
          column = '#in_progress';
        } else {
          column = '#done';
        }
        break;
    }

    this.column = column;
  },

  clear() {
    this.destroy();
    _.each(this.views, (view) => {
      view.remove();
    });
  },

  estimable() {
    if (this.get('story_type') === 'feature') {
      return !this.estimated();
    }
    return false;
  },

  estimated() {
    const estimate = this.get('estimate');
    return !(_.isUndefined(estimate) || _.isNull(estimate));
  },

  notEstimable() {
    const storyType = this.get('story_type');
    return (storyType !== 'feature');
  },

  point_values() {
    return this.collection.project.get('point_values');
  },

  // List available state transitions for this story
  events() {
    switch (this.get('state')) {
      case 'started':
        return ['finish'];
      case 'finished':
        return ['deliver'];
      case 'delivered':
        return ['accept', 'reject'];
      case 'rejected':
        return ['restart'];
      case 'accepted':
        return [];
      default:
        return ['start'];
    }
  },

  // State machine transitions
  start() {
    this.set({ state: 'started' });
  },

  finish() {
    this.set({ state: 'finished' });
  },

  deliver() {
    this.set({ state: 'delivered' });
  },

  accept() {
    this.set({ state: 'accepted' });
  },

  reject() {
    this.set({ state: 'rejected' });
  },

  restart() {
    this.set({ state: 'started' });
  },

  position() {
    return parseFloat(this.get('position'));
  },

  className() {
    let className = `story ${this.get('story_type')}`;
    if (this.estimable() && !this.estimated()) {
      className += ' unestimated';
    }
    return className;
  },

  // Returns the user that owns this Story, or undefined if no user owns
  // the Story
  owned_by() {
    return this.collection.project.users.get(this.get('owned_by_id'));
  },

  requested_by() {
    return this.collection.project.users.get(this.get('requested_by_id'));
  },

  created_at() {
    const d = new Date(this.get('created_at'));
    return d.format(this.timestampFormat);
  },

  hasDetails() {
    return (_.isString(this.get('description')) || this.hasNotes());
  },

  iterationNumber() {
    if (this.get('state') === 'accepted') {
      return this.collection.project.getIterationNumberForDate(this.acceptedAtBeginningOfDay());
    }
  },

  acceptedAtBeginningOfDay() {
    let accepted_at = this.get('accepted_at');
    if (!_.isUndefined(accepted_at)) {
      accepted_at = new Date(accepted_at);
      accepted_at.setHours(0);
      accepted_at.setMinutes(0);
      accepted_at.setSeconds(0);
      accepted_at.setMilliseconds(0);
    }
    return accepted_at;
  },

  // If the story state is 'accepted', and the 'accepted_at' attribute is not
  // set, set it to today's date.
  setAcceptedAt() {
    if (this.get('state') === 'accepted' && !this.get('accepted_at')) {
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      this.set({ accepted_at: today });
    }
  },

  labels() {
    if (!_.isString(this.get('labels'))) {
      return [];
    }
    return _.map(this.get('labels').split(','), label => $.trim(label));
  },

  // Initialize the notes collection on this story, and populate if necessary
  initNotes() {
    this.notes = new NoteCollection();
    this.notes.story = this;
    this.populateNotes();
  },

  // Resets this stories notes collection
  populateNotes() {
    const notes = this.get('notes') || [];
    this.notes.reset(notes);
  },

  // Returns true if any of the story has any saved notes.
  hasNotes() {
    return this.notes.any(note => !note.isNew());
  },

  // Initialize the tasks collection on this story, and populate if necessary
  initTasks() {
    this.tasks = new TaskCollection();
    this.tasks.story = this;
    this.populateTasks();
  },

  populateTasks() {
    const tasks = this.get('tasks') || [];
    this.tasks.reset(tasks);
  },

  sync(method, model, options) {
    let documents;

    if (model.isReadonly) {
      return true;
    }

    documents = options.documents;
    if (!_.isUndefined(documents)) {
      if (documents && documents.length > 0 && documents.val()) {
        model.set('documents', JSON.parse(documents.val()));
      } else {
        // model.set('documents', [{}]);
        model.set('documents', []);
      }
    } else {
      documents = model.get('documents');
      if (!_.isUndefined(documents)) {
        documents = _.map(documents, elem => elem.file);
        model.set('documents', documents);
      }
    }
    Backbone.sync(method, model, options);
  },

  initHistory() {
    this.history = new ActivityCollection();
    this.history.story = this;
  },

  showHistory() {
    window.projectView.historyView.setStory(this);
  },
});

_.defaults(Story.prototype, SharedModelMethods);
