import React from 'react';
import ReactDOM from 'react-dom';
import StoryControls from 'components/story/StoryControls';
import StoryDescription from 'components/story/StoryDescription';
import StoryHistoryLocation from 'components/story/StoryHistoryLocation';
import StorySelect from 'components/story/StorySelect';
import StoryDatePicker from 'components/story/StoryDatePicker';
import StoryNotes from 'components/story/StoryNotes';
import NoteForm from 'components/notes/NoteForm';
import StoryLabels from 'components/story/StoryLabels';
import StoryTasks from 'components/story/StoryTasks';
import TaskForm from 'components/tasks/TaskForm';
import StoryAttachment from 'components/story/StoryAttachment';
import StoryStateButtons from 'components/story/StoryStateButtons';
import StoryEstimateButtons from 'components/story/StoryEstimateButtons';
import AttachmentOptions from 'models/attachmentOptions'
var Clipboard = require('clipboard');

var executeAttachinary = require('libs/execute_attachinary');

var FormView = require('./form_view');
var EpicView = require('./epic_view');

const LOCAL_STORY_REGEXP = /(?!\s|\b)(#\d+)(?!\w)/g;

module.exports = FormView.extend({

  template: require('templates/story.ejs'),
  alert: require('templates/alert.ejs'),

  tagName: 'div',
  linkedStories: {},

  initialize: function(options) {
    _.extend(this, _.pick(options, "isSearchResult"));

    _.bindAll(this, "render", "highlight", "moveColumn", "setClassName",
      "transition", "estimate", "disableForm", "renderNotes",
      "hoverBox", "renderTasks", "handleNoteDelete", "handleSaveError",
      "addEmptyTask", "handleNoteSubmit", "renderTaskForm", "handleTaskSubmit",
      "clickSave", "attachmentDone", "attachmentStart", "handleTaskUpdate",
      "handleTaskSaveSuccess", "handleTaskDelete","attachmentFail",
      "toggleControlButtons");

    // Rerender on any relevant change to the views story
    this.model.on("change", this.render);

    this.model.on("change:title", this.highlight);
    this.model.on("change:description", this.highlight);
    this.model.on("change:column", this.highlight);
    this.model.on("change:state", this.highlight);
    this.model.on("change:position", this.highlight);
    this.model.on("change:estimate", this.highlight);
    this.model.on("change:story_type", this.highlight);

    this.model.on("change:column", this.moveColumn);

    this.model.on("change:estimate", this.setClassName);
    this.model.on("change:state", this.setClassName);

    this.model.on("change:tasks", this.addEmptyTask);
    this.model.on("change:tasks", this.renderTasksCollection);

    this.model.on("render", this.hoverBox);
    // Supply the model with a reference to it's own view object, so it can
    // remove itself from the page when destroy() gets called.
    this.model.views.push(this);

    if (this.model.id) {
      this.id = this.el.id = (this.isSearchResult ? 'search-result-' : '') + this.model.id;
      this.$el.attr('id', 'story-' + this.id);
      this.$el.data('story-id', this.id);
    }

    // Set up CSS classes for the view
    this.setClassName();

    this.on('attachmentOptions', (options) => {
      this.attachmentOptions = options;
      if(this.canEdit()) {
        // attachinary won't re-create the instance with the new
        // signature if the instance for the element is already created
        if(this.$('.attachinary-input').data('attachinary-bond')) {
          this.$('.attachinary-input')
            .fileupload('destroy')
            .data('attachinary-bond').initFileUpload();
        }

        this.renderAttachments();
      }
    });

    this.attachmentOptions = options.attachmentOptions;
  },

  isReadonly: function() {
    return this.model.isReadonly;
  },

  events: {
    "click": "startEdit",
    "click .epic-link": "openEpic",
    "click .cancel": "cancelEdit",
    "click .clone-story": "cloneStory",
    "click .transition": "transition",
    "change select.story_type": "render",
    "click .destroy": "clear",
    "click .description": "editDescription",
    "click .edit-description": "editDescription",
    "click .toggle-history": "showHistory",
    "sortupdate": "sortUpdate",
    "fileuploaddone": "attachmentDone",
    "fileuploadstart": "attachmentStart",
    "fileuploadfail": "attachmentFail",
    "click #locate": "highlightSearchedStory"
  },

  // Triggered whenever a story is dropped to a new position
  sortUpdate: function(ev, ui) {
    // The target element, i.e. the StoryView.el element
    var target = $(ev.target);

    // Initially, try and get the id's of the previous and / or next stories
    // by just searching up above and below in the DOM of the column position
    // the story was dropped on.  The case where the column is empty is
    // handled below.
    var previous_story_id = target.prev('.story').data('story-id');
    var next_story_id = target.next('.story').data('story-id');

    // Set the story state if drop column is chilly_bin or backlog
    var column = target.parent().attr('id');
    if (column === 'backlog' || (column === 'in_progress' && this.model.get('state') === 'unscheduled')) {
      this.model.set({state: 'unstarted'});
    } else if (column === 'chilly_bin') {
      this.model.set({state: 'unscheduled'});
      [previous_story_id, next_story_id] = [next_story_id, previous_story_id];
    }

    // If both of these are unset, the story has been dropped on an empty
    // column, which will be either the backlog or the chilly bin as these
    // are the only columns that can receive drops from other columns.
    if (_.isUndefined(previous_story_id) && _.isUndefined(next_story_id)) {

      var beforeSearchColumns = this.model.collection.project.columnsBefore('#' + column);
      var afterSearchColumns  = this.model.collection.project.columnsAfter('#' + column);

      var previousStory = _.last(this.model.collection.columns(beforeSearchColumns));
      var nextStory = _.first(this.model.collection.columns(afterSearchColumns));

      if (typeof previousStory !== 'undefined') {
        previous_story_id = previousStory.id;
      }
      if (typeof nextStory !== 'undefined') {
        next_story_id = nextStory.id;
      }
    }
    this.model.move(previous_story_id, next_story_id);
    this.model.save();
  },

  transition: function(ev) {
    // The name of the function that needs to be called on the model is the
    // value of the form button that was clicked.
    var transitionEvent = ev.target.value;
    _.each(I18n.t('story.events'), function(value, key) {
      if( value === transitionEvent )
        transitionEvent = key;
    })

    if (transitionEvent === 'accept' || transitionEvent === 'reject') {
      var confirmed = confirm( I18n.t('story.definitive_sure', {action: transitionEvent} ));

      if (!confirmed) return;
    }

    this.saveInProgress = true;
    this.render();

    this.model[transitionEvent]({silent:true});

    var that = this;
    this.model.save(null, {
      success: function(model, response) {
        that.saveInProgress = false;
        that.render();
      },
      error: function(model, response) {
        var json = $.parseJSON(response.responseText);
        window.projectView.notice({
          title: I18n.t("save error"),
          text: model.errorMessages()
        });
        that.saveInProgress = false;
        that.render();
      }
    });
  },

  estimate: function(points) {
    this.saveInProgress = true;
    this.render();
    this.model.set({ estimate: points });

    var that = this;
    this.model.save(null, {
      success: function(model, response) {
        that.saveInProgress = false;
        that.render();
      },
      error: function(model, response) {
        var json = $.parseJSON(response.responseText);
        window.projectView.notice({
          title: I18n.t("save error"),
          text: model.errorMessages()
        });
        that.saveInProgress = false;
        that.render();
      }
    });
  },

  canEdit: function() {
    var isEditable              = this.model.get('editing');
    var isSearchResultContainer = this.$el.hasClass('searchResult');
    var clickFromSearchResult   = this.model.get('clickFromSearchResult');
    if (_.isUndefined(isEditable))
      isEditable = false;
    if (_.isUndefined(clickFromSearchResult))
      clickFromSearchResult = false;
    if ( clickFromSearchResult && isSearchResultContainer ) {
      return isEditable;
    } else if ( !clickFromSearchResult && !isSearchResultContainer ) {
      return isEditable;
    } else {
      return false;
    }
  },

  // Move the story to a new column
  moveColumn: function() {
    this.$el.appendTo(this.model.get('column'));
  },

  startEdit: function(e) {
    if (this.eventShouldExpandStory(e)) {
      this.model.set({editing: true, editingDescription: false, clickFromSearchResult: this.$el.hasClass('searchResult')});
      this.removeHoverbox();
    }
  },

  openEpic: function(e) {
    e.stopPropagation();
    var label = $(e.target).text();
    new EpicView({model: this.model.collection.project, label: label});
  },

  // When a story is clicked, this method is used to check whether the
  // corresponding click event should expand the story into its form view.
  eventShouldExpandStory: function(e) {
    // Shouldn't expand if it's already expanded.
    if (this.canEdit()) {
      return false;
    }
    // Should expand if the click wasn't on one of the buttons.
    if ($(e.target).is('input')) return false
    if ($(e.target).is('.input')) return false
    if ($(e.target).is('button')) return false
    if ($(e.target).parent().is('button')) return false
    return true;
  },

  cancelEdit: function() {
    this.model.set({editing: false});

    // If the model was edited, but the edits were deemed invalid by the
    // server, the local copy of the model will still be invalid and have
    // errors set on it after cancel.  So, reload it from the server, which
    // will return the attributes to their true state.
    if (this.model.hasErrors()) {
      this.model.unset('errors');
      this.model.fetch();
    }

    // If this is a new story and cancel is clicked, the story and view
    // should be removed.
    if (this.model.isNew()) {
      this.model.clear();
    }
  },

  saveEdit: function(event, editMode) {
    this.disableForm();

    // Call this here to ensure the story gets it's accepted_at date set
    // before the story collection callbacks are run if required.  The
    // collection callbacks need this to be set to know which iteration to
    // put an accepted story in.
    this.model.setAcceptedAt();

    var that = this;
    var documents = $(event.currentTarget).closest('.story')
      .find("[type='hidden'][name='attachments']");

    this.model.save(null, { documents: documents,
      success: function(model, response) {
        that.enableForm();
        that.model.set({ editing: editMode });
        that.toggleControlButtons(false);
        that.highlightStory();
      },
      error: function(model, response) {
        var json = $.parseJSON(response.responseText);
        model.set({editing: true, errors: json.story.errors});

        window.projectView.notice({
          title: I18n.t("save error"),
          text: model.errorMessages()
        });

        that.enableForm();
      }
    });
  },

  // Delete the story and remove it's view element
  clear: function() {
    if (confirm("Are you sure you want to destroy this story?"))
      this.model.clear();
  },

  editDescription: function(ev) {
    const $target = $(ev.target);
    if ($target.hasClass('story-link') || $target.hasClass('story-link-icon'))
      return;

    this.model.set({editingDescription: true});
    this.render();
  },

  // Visually highlight the story if an external change happens
  highlight: function() {
    if(!this.model.get('editing')) {
      // Workaround for http://bugs.jqueryui.com/ticket/5506
      if (this.$el.is(':visible')) {
        this.$el.effect("highlight", {}, 3000);
      }
    }
  },

  cloneStory: function () {
    this.cancelEdit();
    const clonedStory = this.model.clone();
    this.resetAttributes(clonedStory);

    if (clonedStory.isNew()) {
      this.model.collection.add(clonedStory);
      clonedStory.save(null, {
        success: (model, response) => {
          _.last(clonedStory.views).highlight();
        },
        error: (model, response) => {
          window.projectView.notice({
            title: I18n.t("save error"),
            text: model.errorMessages(),
          });
        }
      });
    }
  },

  resetAttributes: function (story) {
    story.set({
      id: null,
      created_at: null,
      updated_at: null,
      position: null,
      state: "unscheduled",
    });
    return story;
  },

  highlightSearchedStory: function () {
    this.scrollToStory();
    this.highlightStory();
  },

  scrollToStory: function () {
    const storyElement = this.storyElement();
    $('.content-wrapper').animate({
      scrollTop: storyElement.offset().top - 15
    }, 'fast');
  },

  highlightStory: function () {
    const element = this.storyElement();
    element.effect("highlight", {color: 'lightgreen'}, 1500);
  },

  storyElement: function ()  {
    return $(`#story-${ this.model.get('id') }`);
  },

  render: function() {
    const storyControlsContainer = this.$('[data-story-controls]').get(0);
    if (storyControlsContainer) {
      ReactDOM.unmountComponentAtNode(storyControlsContainer);
    }

    var isGuest = (
      this.model.collection !== undefined &&
      this.model.collection.project.current_user !== undefined &&
      this.model.collection.project.current_user.get('guest?')
    );

    if(this.canEdit()) {
      this.renderExpanded(isGuest);
    } else {
      this.renderCollapsed(isGuest);
    }

    this.hoverBox();
    this.handleBackLoggedRelease();
    return this;
  },

  renderExpanded: function(isGuest) {
    this.$el.empty();
    this.$el.addClass('editing');

    const $storyControls = $('<div data-story-controls></div>');
    this.$el.append($storyControls);
    this.appendHistoryLocation();
    this.appendTitle();
    this.appendEstimateTypeState();
    this.appendRequestedAndOwnedBy();
    this.appendTags();
    this.appendDescription();
    this.$el.append($('<div data-story-tasks></div>'));
    this.$el.append($('<div data-story-task-form></div>'));
    this.appendAttachments();
    this.$el.append($('<div data-story-notes></div>'));
    this.$el.append($('<div data-story-note-form></div>'));
    if(this.model.get('story_type') === 'release') {
      this.$el.empty();
      this.$el.append($storyControls);
      this.renderReleaseStory();
    }
    this.renderReactComponents();

    if (isGuest) { this.toggleControlButtons(true, false) }
  },

  appendHistoryLocation: function() {
    if (this.id !== undefined) {
      const $storyHistoryLocation = $('<div data-story-history-location></div>');
      this.$el.append($storyHistoryLocation);
    }
  },

  appendTitle: function() {
    this.$el.append(
      this.makeFormControl(this.makeTitle())
    );
  },

  appendEstimateTypeState: function() {
    this.$el.append(
      this.makeFormControl(function(div) {
        $(div).addClass('form-inline');

        const $storyEstimate = $('<div class="form-group" data-story-estimate></div>');
        $(div).append($storyEstimate);

        const $storyType = $('<div class="form-group" data-story-type></div>');
        $(div).append($storyType);

        const $storyState = $('<div class="form-group" data-story-state></div>');
        $(div).append($storyState);
      })
    );
  },

  appendRequestedAndOwnedBy: function() {
    this.$el.append(
      this.makeFormControl(function(div) {
        $(div).addClass('form-inline');

        const $storyRequestedBy = $('<div class="form-group" data-requested-by></div>');
        $(div).append($storyRequestedBy);

        const $storyOwnedBy = $('<div class="form-group" data-owned-by></div>');
        $(div).append($storyOwnedBy);
      })
    );
  },

  appendTags: function() {
    this.$el.append(
      this.makeFormControl(function(div) {
        const $storyTags = $('<div class="form-group" data-tags></div>');
        $(div).append($storyTags);
      })
    );
  },

  appendDescription: function() {
    this.$el.append(
      this.makeFormControl(function(div) {
        var $storyDescription = $('<div class="story-description"><div>');
        $(div).append($storyDescription);
      })
    );
  },

  appendAttachments: function() {
    this.$el.append(
      this.makeFormControl(function(div) {
        const $storyAttachments = $('<div class="story-attachments"></div>');
        $(div).append($storyAttachments);

        clearTimeout(window.executeAttachinaryTimeout);
        window.executeAttachinaryTimeout = setTimeout(executeAttachinary, 1000);
      })
    );
  },

  renderCollapsed: function(isGuest) {
    this.$el.removeClass('editing');
    this.$el.html(this.template({story: this.model, view: this}));

    const stateButtons = this.$('[data-story-state-buttons]').get(0)
    if(stateButtons) {
      ReactDOM.render(
        <StoryStateButtons
          events={this.model.events()}
        />,
        stateButtons
      );
    }

    const estimateButtons = this.$('[data-story-estimate-buttons]').get(0)
    if(estimateButtons) {
      ReactDOM.render(
        <StoryEstimateButtons
          points={this.model.point_values()}
          onClick={this.estimate}
        />,
        estimateButtons
      );
    }

    if (isGuest) { this.$el.find('.state-actions').find('.transition').prop('disabled', true) }
  },

  renderReactComponents: function() {
    this.renderControls();
    this.renderHistoryLocationContainer();
    this.renderDescription();
    this.renderTagsInput();
    this.renderAttachments();
    this.renderSelects();
    this.renderTasks();
    this.renderNotes();
  },

  renderControls: function() {
    ReactDOM.render(
      <StoryControls
        onClickSave={this.clickSave}
        onClickCancel={this.cancelEdit}
      />,
      this.$('[data-story-controls]').get(0)
    );
  },

  renderHistoryLocationContainer: function() {
    const historyLocationContainer = this.$('[data-story-history-location]').get(0);
    if (historyLocationContainer) {
      ReactDOM.render(
        <StoryHistoryLocation
          id={this.id}
          url={`${this.getLocation()}#story-${this.id}`}
        />,
        historyLocationContainer
      );
      new Clipboard('.btn-clipboard');
    }
  },

  renderDescription: function() {
    const description = this.$('.story-description')[0];
    if (description) {
      ReactDOM.render(
        <StoryDescription
          name='description'
          linkedStories={this.linkedStories}
          isReadonly={this.isReadonly()}
          description={this.parseDescription()}
          usernames={window.projectView.usernames()}
          isNew={this.model.isNew()}
          editingDescription={this.model.get('editingDescription')}
          value={this.model.get("description")}
          fileuploadprogressall={this.uploadProgressBar}
          onChange={ (event) => this.onChangeModel(event.target.value, "description") }
          onClick={this.editDescription}
        />,
        description
      );
    }
  },

  renderTagsInput: function() {
    const tagsInput = this.$('[data-tags]')[0];
    if (tagsInput) {
      ReactDOM.render(
        <StoryLabels
          name='labels'
          className='labels'
          value={this.model.get('labels')}
          availableLabels={this.model.collection.labels}
          onChange={ (event) => this.onChangeModel(event.target.value, "labels") }
          disabled={this.isReadonly()}
        />,
        tagsInput
      );
    }
  },

  renderAttachments: function() {
    const attachments = this.$('.story-attachments')[0];
    if(attachments) {
      ReactDOM.render(
        <StoryAttachment
          name='attachments'
          isReadonly={this.isReadonly()}
          filesModel={this.model.get('documents')}
          options={this.attachmentOptions}
        />,
        attachments
      );
    }
  },

  renderSelects: function() {
    const $storyEstimateSelect = this.$('[data-story-estimate]');
    if ($storyEstimateSelect.length) {
      const storyEstimateOptions = this.model.point_values().map(this.createStoryEstimateOptions);
      ReactDOM.render(
        <StorySelect
          name='estimate'
          className='story_estimate'
          blank={I18n.t('story.no_estimate')}
          options={storyEstimateOptions}
          selected={this.model.get('estimate')}
          disabled={this.model.notEstimable() || this.isReadonly()}
        />,
        $storyEstimateSelect.get(0)
      );

      this.bindElementToAttribute($storyEstimateSelect.find('select[name="estimate"]'), 'estimate');
    }

    const $storyTypeSelect = this.$('[data-story-type]');
    if ($storyTypeSelect.length) {
      const typeOptions = ["feature", "chore", "bug", "release"];
      const storyTypeOptions = typeOptions.map(this.createStoryTypeOptions);
      ReactDOM.render(
        <StorySelect
          className='story_type'
          options={storyTypeOptions}
          name='story_type'
          selected={this.model.get('story_type')}
          disabled={this.isReadonly()}
        />,
        $storyTypeSelect.get(0)
      );

      this.bindElementToAttribute($storyTypeSelect.find('select[name="story_type"]'), 'story_type');
    }

    const $storyStateSelect = this.$('[data-story-state]');
    if ($storyStateSelect.length) {
      const stateOptions = ["unscheduled", "unstarted", "started", "finished", "delivered", "accepted", "rejected"];
      const storyStateOptions = stateOptions.map(this.createStoryStateOptions);
      ReactDOM.render(
        <StorySelect
          name='state'
          className='story_state'
          options={storyStateOptions}
          selected={this.model.get('state')}
          disabled={this.isReadonly()}
        />,
        $storyStateSelect.get(0)
      );

      this.bindElementToAttribute($storyStateSelect.find('select[name="state"]'), 'state');
    }

    const $storyRequestedBySelect = this.$('[data-requested-by]');
    if ($storyRequestedBySelect.length) {
      const storyRequestedByOptions = this.model.collection.project.users.forSelect();
      ReactDOM.render(
        <StorySelect
          name='requested_by'
          blank='---'
          className='requested_by_id'
          options={storyRequestedByOptions}
          selected={this.model.get('requested_by_id')}
          disabled={this.isReadonly()}
        />,
        $storyRequestedBySelect.get(0)
      );

      this.bindElementToAttribute($storyRequestedBySelect.find('select[name="requested_by"]'), 'requested_by_id');
    }

    const $storyOwnedBySelect = this.$('[data-owned-by]');
    if ($storyOwnedBySelect.length) {
      const storyOwnedByOptions = this.model.collection.project.users.forSelect();
      ReactDOM.render(
        <StorySelect
          name='owned_by'
          className='owned_by_id'
          options={storyOwnedByOptions}
          blank='---'
          selected={this.model.get('owned_by_id')}
          disabled={this.isReadonly()}
        />,
        $storyOwnedBySelect.get(0)
      );

      this.bindElementToAttribute($storyOwnedBySelect.find('select[name="owned_by"]'), 'owned_by_id');
    }
  },

  renderNotes: function() {
    const $storyNotes = this.$('[data-story-notes]');
    if ($storyNotes.length && !this.model.isNew()) {
      const isReadonly = this.isReadonly();
      const notes = this.model.notes;

      ReactDOM.render(
        <StoryNotes
          notes={isReadonly ? notes : notes.slice(0,-1)}
          disabled={isReadonly}
          handleDelete={this.handleNoteDelete}
        />,
        $storyNotes.get(0)
      );

      if (!isReadonly) {
        this.renderNoteForm();
      }
    }
  },

  renderNoteForm: function() {
    const $noteForm = this.$('[data-story-note-form]');
    if ($noteForm.length) {
      this.addEmptyNote();

      ReactDOM.render(
        <NoteForm
          note={this.model.notes.last()}
          onSubmit={this.handleNoteSubmit}
        />,
        $noteForm.get(0)
      );

      $noteForm.find('textarea').atwho({
        at: '@',
        data: window.projectView.usernames()
      });
    }
  },

  handleNoteDelete: function(note) {
    note.destroy();
    this.renderNotes();
  },

  handleNoteSubmit: function({ note, newValue }) {
    note.set({note: newValue});
    return note.save(null, {
      success: () => window.projectView.model.fetch(),
      error: this.handleSaveError
    });
  },

  renderTasks: function() {
    const $storyTasks = this.$('[data-story-tasks]');
    if ($storyTasks.length && !this.model.isNew()) {
      const isReadonly = this.isReadonly();
      const tasks = this.model.tasks;

      ReactDOM.render(
        <StoryTasks
          tasks={isReadonly ? tasks : tasks.slice(0, -1)}
          disabled={isReadonly}
          handleUpdate={this.handleTaskUpdate}
          handleDelete={this.handleTaskDelete}
        />,
        $storyTasks.get(0)
      );

      if (!isReadonly) {
        this.renderTaskForm();
      }
    }
  },

  renderTaskForm: function() {
    const $taskForm = this.$('[data-story-task-form]');
    if ($taskForm.length) {
      this.addEmptyTask();

      ReactDOM.render(
        <TaskForm
          onSubmit={this.handleTaskSubmit}
          task={this.model.tasks.last()}
        />,
        $taskForm.get(0)
      );
    }
  },

  handleTaskSubmit: function({task, taskName}) {
    task.set('name', taskName);
    return task.save(null, {
      dataType: 'text',
      success: this.handleTaskSaveSuccess,
      error: this.handleSaveError
    });
  },

  handleTaskDelete: function(task) {
    task.destroy();
    this.renderTasks();
  },

  handleTaskSaveSuccess: function() {
    window.projectView.model.fetch();
    this.renderTasks();
  },

  handleTaskUpdate: function({task, done}) {
    task.set('done', done);
    task.save(null, {
      dataType: 'text',
      success: this.handleTaskSaveSuccess,
      error: this.handleSaveError
    });
  },

  handleSaveError: function(model, response) {
    const json = JSON.parse(response.responseText);
    model.set({errors: json[model.name].errors});
    window.projectView.noticeSaveError(model);
  },

  createStoryEstimateOptions: function(option) {
    return [option, option];
  },

  createStoryTypeOptions: function(option) {
    return [I18n.t('story.type.' + option), option];
  },

  createStoryStateOptions: function(option) {
    return [I18n.t('story.state.' + option), option];
  },

  makeTitle: function() {
    return function(div) {
      $(div).append(this.label("title", I18n.t('activerecord.attributes.story.title')));
      $(div).append(this.textField("title", {
        'class' : 'title form-control input-sm',
        'placeholder': I18n.t('story title'),
        'maxlength': 255,
        'disabled': this.isReadonly()
      }));
    }
  },

  renderReleaseStory: function() {
    this.$el.append(
      this.makeFormControl(this.makeTitle())
    );

    if(this.model.get('editing')) {
      this.$el.append(
        this.makeFormControl(function(div) {
          const $storyType = $('<div class="form-group" data-story-type></div>');
          $(div).append($storyType);
        }));
    }

    const $storyDate = $('<div class="form-group" data-story-datepicker></div>');
    this.$el.append($storyDate);

    ReactDOM.render(
      <StoryDatePicker
        releaseDate={this.model.get('release_date')}
        onChangeCallback={function() {$('input[name=release_date]').trigger('change')}}
      />,
      $storyDate.get(0)
    );

    const dateInput = this.$('input[name=release_date]');
    this.bindElementToAttribute(dateInput, 'release_date');

    this.$el.append(
      this.makeFormControl(function(div) {
        var $description = $('<div class="story-description"><div>');
        $(div).append($description);
      })
    );
  },

  parseDescription: function() {
    const description = this.model.get('description') || '';
    var id, story;
    return description.replace(LOCAL_STORY_REGEXP, story_id => {
      id = story_id.substring(1);
      story = this.model.collection.get(id);
      this.linkedStories[id] = story;
      return (story) ? `<p data-story-id='${id}'></p>` : story_id;
    });
  },

  setClassName: function() {
    var className = [
      'story', this.model.get('story_type'), this.model.get('state')
    ].join(' ');
    if (this.model.estimable() && !this.model.estimated()) {
      className += ' unestimated';
    }
    if (this.isSearchResult) {
      className += ' searchResult';
    }
    this.className = this.el.className = className;
    return this;
  },

  saveInProgress: false,

  disableForm: function() {
    this.$el.find('input,select,textarea').attr('disabled', 'disabled');
    this.$el.find('a.collapse,a.expand').removeClass(/icons-/).addClass('icons-throbber');
  },

  enableForm: function() {
    this.$el.find('input,select,textarea').removeAttr('disabled');
    this.$el.find('a.collapse').removeClass(/icons-/).addClass("icons-collapse");
  },

  onChangeModel: function(value, element) {
    this.model.set({ [element]: value }, {silent: true});
  },

  addEmptyTask: function() {
    if (this.model.isNew()) {
      return;
    }

    var task = this.model.tasks.last();
    if (task && task.isNew()) {
      return;
    }

    this.model.tasks.add({});
  },

  addEmptyNote: function() {

    // Don't add an empty note if the story is unsaved.
    if (this.model.isNew()) {
      return;
    }

    // Don't add an empty note if the notes collection already has a trailing
    // new Note.
    var last = this.model.notes.last();
    if (last && last.isNew()) {
      return;
    }

    // Add a new unsaved note to the collection.  This will be rendered
    // as a form which will allow the user to add a new note to the story.
    this.model.notes.add({});
    this.$el.find('a.collapse,a.expand').removeClass(/icons-/).addClass('icons-throbber');
  },

  // FIXME Move to separate view
  hoverBox: function() {
    if (!this.model.isNew()) {
      this.$el.find('.popover-activate').popover({
        delay: 200, // A small delay to stop the popovers triggering whenever the mouse is moving around
        html: true,
        trigger: 'hover',
        title: () => this.model.get("title"),
        content: () => require('templates/story_hover.ejs')({
          story: this.model,
          noteTemplate: require('templates/note.ejs')
        })
      });
    }
  },

  removeHoverbox: function() {
    $('.popover').remove();
  },

  backLoggedRelease: function() {
    var backlogged = false;
    const {
      collection,
      attributes,
    } = this.model;
    if(collection.project.iterations) {
      collection.project.iterations.forEach((iteration) => {
        iteration.stories().forEach((story) => {
          if (story.id === attributes.id && attributes.release_date) {
            var iteration_date = new Date(iteration.startDate());
            var release_date = new Date(attributes.release_date);
            backlogged = iteration_date > release_date;
          }
        })
      });
      return backlogged;
    }
  },

  handleBackLoggedRelease: function() {
    this.$el.toggleClass('backlogged-release', this.backLoggedRelease());
    if(this.backLoggedRelease()){
      this.$el.attr('title', I18n.t('story.warnings.backlogged_release'));
    }
  },

  setFocus: function() {
    if (this.model.get('editing') === true ) {
      this.$('input.title').first().focus();
    }
  },

  makeFormControl: function(content) {
    var div = this.make('div', {
      class: 'form-group'
    });
    if (typeof content === 'function') {
      content.call(this, div);
    } else if (typeof content === 'object') {
      var $div = $(div);
      if (content.label) {
        $div.append(this.label(content.name));
        $div.append('<br/>');
      }
      $div.append(content.control);
    }
    return div;
  },

  attachmentDone: function(event) {
    if (this.model.isNew()) {
      this.toggleControlButtons(false);
    } else {
      this.saveEdit(event, true);
    }
  },

  clickSave: function(event) {
    this.saveEdit(event, false);
  },

  attachmentStart: function() {
    this.toggleControlButtons(true);
  },

  attachmentFail: function() {
    this.toggleControlButtons(false);

    this.$('.uploads').prepend(this.alert({
      className: 'story-alert alert-danger',
      message: I18n.t('story.errors.failed_upload')
    }));
  },

  toggleControlButtons: function(isDisabled, changeCancel) {
    var $storyControls = this.$el.find('.story-controls');
    $storyControls.find('.submit, .destroy').prop('disabled', isDisabled);

    if (changeCancel === undefined) { changeCancel = true }
    if (changeCancel) { $storyControls.find('.cancel').prop('disabled', isDisabled); }
  },

  getLocation: function() {
    var location = window.location.href;
    var hashIndex = location.indexOf('#');
    var endIndex = hashIndex > 0 ? hashIndex : location.length;
    return location.substring(0, endIndex);
  },

  showHistory: function() {
    this.model.showHistory();
  },
});
