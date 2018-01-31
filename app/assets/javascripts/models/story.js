var ActivityCollection = require('collections/activity_collection');
var NoteCollection = require('collections/note_collection');
var TaskCollection = require('collections/task_collection');
var SharedModelMethods = require('mixins/shared_model_methods');
const POSITION_DECIMAL_PLACES_LIMIT = 10;
var Story = module.exports = Backbone.Model.extend({
  defaults: {
    events: [],
    documents: [],
    state: "unscheduled",
    story_type: "feature"
  },

  name: 'story',

  i18nScope: 'activerecord.attributes.story',

  timestampFormat: 'd mmm yyyy, h:MMtt',

  isReadonly: false,

  initialize: function(args) {
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

  setReadonly: function () {
    var accepted = this.get('state') === 'accepted' && this.get('accepted_at') !== undefined;
    var isGuest = (
      this.collection !== undefined &&
      this.collection.project.current_user !== undefined &&
      this.collection.project.current_user.get('guest?')
    );

    if (isGuest || accepted) {
      this.isReadonly = true
    }
  },

  changeState: function(model, newValue) {
    if (newValue === 'started') {
      model.set({ owned_by_id: model.collection.project.current_user.id }, true);
    }

    model.setAcceptedAt();
    model.setColumn();
  },

  sortUpdate: function(column, previous_story_id, next_story_id) {
    this.dropToColumn(column);
    if(column === 'chilly_bin'){
      [previous_story_id, next_story_id] = [next_story_id, previous_story_id];
    }
    // If both of these are unset, the story has been dropped on an empty
    // column, which will be either the backlog or the chilly bin as these
    // are the only columns that can receive drops from other columns.
    if (_.isUndefined(previous_story_id) && _.isUndefined(next_story_id)) {

      const beforeSearchColumns = this.collection.project.columnsBefore('#' + column);
      const afterSearchColumns  = this.collection.project.columnsAfter('#' + column);

      var previousStory = _.last(this.collection.columns(beforeSearchColumns));
      var nextStory = _.first(this.collection.columns(afterSearchColumns));

      if (typeof previousStory !== 'undefined') {
        previous_story_id = previousStory.id;
      }
      if (typeof nextStory !== 'undefined') {
        next_story_id = nextStory.id;
      }
    }

    this.move(previous_story_id, next_story_id);
    this.save();
  },

  dropToColumn: function(column) {
    if (column === 'backlog' || (column === 'in_progress' && this.get('state') === 'unscheduled')) {
      this.set({state: 'unstarted'});
    } else if (column === 'chilly_bin') {
      this.set({state: 'unscheduled'});
    }
    return this;
  },

  move: function(previous_story_id, next_story_id) {
    if (this.collection) {
      const newPosition = this.collection.calculateNewPosition(previous_story_id, next_story_id);
      this.setPosition(newPosition);
    }
    return this;
  },

  setPosition: function(position) {
    this.set({ position });
    if (this.positionDecimalPlacesOverflow()){
      this.collection.normalizePositions(this.column);
    }
  },

  positionDecimalPlacesOverflow: function() {
    var positionDecimalPlaces = this.getPrecision(this.position());
    if (positionDecimalPlaces > POSITION_DECIMAL_PLACES_LIMIT){
      return true;
    }
  },

  getPrecision: function (number) {
    const n = number.toString().split(".");
    return n.length > 1 ? n[1].length : 0;
  },

  setColumn: function() {

    var column = '#in_progress';

    switch(this.get('state')) {
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

  clear: function() {
    this.destroy();
    _.each(this.views, function(view) {
      view.remove();
    });
  },

  estimable: function() {
    if (this.get('story_type') === 'feature') {
      return !this.estimated();
    } else {
      return false;
    }
  },

  estimated: function() {
    var estimate = this.get('estimate');
    return !(_.isUndefined(estimate) || _.isNull(estimate));
  },

  notEstimable: function () {
    var storyType = this.get('story_type');
    return (storyType !== 'feature');
  },

  point_values: function() {
    return this.collection.project.get('point_values');
  },

  // List available state transitions for this story
  events: function() {
    switch (this.get('state')) {
      case 'started':
        return ["finish"];
      case 'finished':
        return ["deliver"];
      case 'delivered':
        return ["accept", "reject"];
      case 'rejected':
        return ["restart"];
      case 'accepted':
        return [];
      default:
        return ["start"];
    }
  },

  // State machine transitions
  start: function() {
    this.set({state: "started"});
  },

  finish: function() {
    this.set({state: "finished"});
  },

  deliver: function() {
    this.set({state: "delivered"});
  },

  accept: function() {
    this.set({state: "accepted"});
  },

  reject: function() {
    this.set({state: "rejected"});
  },

  restart: function() {
    this.set({state: "started"});
  },

  position: function() {
    return parseFloat(this.get('position'));
  },

  className: function() {
    var className = 'story ' + this.get('story_type');
    if (this.estimable() && !this.estimated()) {
      className += ' unestimated';
    }
    return className;
  },

  // Returns the user that owns this Story, or undefined if no user owns
  // the Story
  owned_by: function() {
    return this.collection.project.users.get(this.get('owned_by_id'));
  },

  requested_by: function() {
    return this.collection.project.users.get(this.get('requested_by_id'));
  },

  created_at: function() {
    var d = new Date(this.get('created_at'));
    return d.format(this.timestampFormat);
  },

  hasDetails: function() {
    return (_.isString(this.get('description')) || this.hasNotes());
  },

  iterationNumber: function() {
    if (this.get('state') === "accepted") {
      return this.collection.project.getIterationNumberForDate(this.acceptedAtBeginningOfDay());
    }
  },

  acceptedAtBeginningOfDay: function() {
    var accepted_at = this.get("accepted_at");
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
  setAcceptedAt: function() {
    if (this.get('state') === "accepted" && !this.get('accepted_at')) {
      var today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      this.set({accepted_at: today});
    }
  },

  labels: function() {
    if (!_.isString(this.get('labels'))) {
      return [];
    }
    return _.map(this.get('labels').split(','), function(label) {
      return $.trim(label);
    });
  },

  // Initialize the notes collection on this story, and populate if necessary
  initNotes: function() {
    this.notes = new NoteCollection();
    this.notes.story = this;
    this.populateNotes();
  },

  // Resets this stories notes collection
  populateNotes: function() {
    var notes = this.get("notes") || [];
    this.notes.reset(notes);
  },

  // Returns true if any of the story has any saved notes.
  hasNotes: function() {
    return this.notes.any(function(note) {
      return !note.isNew();
    });
  },

  // Initialize the tasks collection on this story, and populate if necessary
  initTasks: function() {
    this.tasks = new TaskCollection();
    this.tasks.story = this;
    this.populateTasks();
  },

  populateTasks: function() {
    var tasks = this.get('tasks') || [];
    this.tasks.reset(tasks);
  },

  sync: function(method, model, options) {
    var documents;

    if( model.isReadonly ) {
      return true;
    }

    documents = options.documents;
    if(!_.isUndefined(documents)) {
      if(documents && documents.length > 0 && documents.val()) {
        model.set('documents', JSON.parse(documents.val()));
      } else {
        model.set('documents', [{}]);
      }
    } else {
      documents = model.get('documents');
      if(!_.isUndefined(documents)) {
        documents = _.map(documents, function(elem) {
          return elem["file"];
        });
        model.set('documents', documents);
      }
    }
    Backbone.sync(method, model, options);
  },

  initHistory: function() {
    this.history = new ActivityCollection();
    this.history.story = this;
  },

  showHistory: function() {
    window.projectView.historyView.setStory(this);
  }
});

_.defaults(Story.prototype, SharedModelMethods);
