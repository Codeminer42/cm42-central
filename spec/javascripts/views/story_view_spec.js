import StoryView from 'views/story_view';
import React from 'react';
import template from 'templates/story.ejs';
import OriginalStory from 'models/story';
import { server } from '../mocks/server';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { http, HttpResponse } from 'msw';

const url = '/path/to/story';

vi.mock('react-clipboard.js', () => ({
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe('StoryView', function () {
  let story;
  let new_story;
  let view;
  let new_story_view;
  let set;

  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'error',
    });
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(function () {
    window.projectView = {
      availableTags: [],
      notice: vi.fn(),
      noticeSaveError: vi.fn(),
    };
    vi.spyOn(window.md, 'makeHtml').mockReturnValue('');
    var Note = Backbone.Model.extend({
      name: 'note',
      humanAttributeName: vi.fn(),
    });
    var Task = Backbone.Model.extend({
      name: 'task',
      humanAttributeName: vi.fn(),
    });
    var NotesCollection = Backbone.Collection.extend({ model: Note });
    var TasksCollection = Backbone.Collection.extend({ model: Task });
    var Story = Backbone.Model.extend({
      name: 'story',
      defaults: { story_type: 'feature' },
      estimable: function () {
        return true;
      },
      estimated: function () {
        return false;
      },
      notEstimable: function () {
        return true;
      },
      point_values: function () {
        return [0, 1, 2];
      },
      hasErrors: function () {
        return false;
      },
      errorsOn: function () {
        return false;
      },
      url: '/path/to/story',
      collection: {
        project: {
          users: {
            forSelect: function () {
              return [];
            },
          },
          projectBoard: {
            stories: {
              get(s) {
                return s;
              },
            },
          },
        },
      },
      start: function () {
        this.set({ state: 'started' });
      },
      deliver: function () {
        this.set({ state: 'delivered' });
      },
      accept: function () {
        this.set({ state: 'accepted' });
      },
      reject: function () {
        this.set({ state: 'rejected' });
      },
      hasDetails: function () {
        return true;
      },
      events: OriginalStory.prototype.events,
      humanAttributeName: vi.fn(),
      setAcceptedAt: vi.fn(),
      errorMessages: vi.fn(),
      views: [],
      clickFromSearchResult: false,
      isSearchResult: false,
    });
    story = new Story({ id: '999', title: 'Story' });
    new_story = new Story({ title: 'New Story' });
    story.notes = new_story.notes = new NotesCollection();
    story.tasks = new_story.tasks = new TasksCollection();
    view = new StoryView({
      model: story,
    });
    new_story_view = new StoryView({
      model: new_story,
    });

    window.projectView.usernames = vi.fn();

    afterEach(function () {
      window.md.makeHtml.mockRestore();
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  describe('class name', function () {
    it('should have the story class', function () {
      expect(view.$el[0]).toHaveClass('story');
    });

    it('should have the story type class', function () {
      expect(view.$el[0]).toHaveClass('feature');
    });

    it('should have the unestimated class', function () {
      expect(view.$el[0]).toHaveClass('unestimated');

      // Should not have the unestimated class if it's been estimated
      vi.spyOn(view.model, 'estimated').mockReturnValueOnce(true);
      view.model.set({ estimate: 1 });
      expect(view.$el[0]).not.toHaveClass('unestimated');
    });

    it('should have the story state class', function () {
      expect(view.$el[0]).toHaveClass('unestimated');
      view.model.set({ state: 'accepted' });
      expect(view.$el[0]).toHaveClass('accepted');
    });
  });

  describe('id', function () {
    it('should have an id', function () {
      expect(view.id).toEqual(view.model.id);
      expect(view.$el.attr('id')).toBe('story-' + view.model.id);
    });
  });

  describe('startEdit', function () {
    let e;

    beforeEach(function () {
      e = {};
      view.model.set = vi.fn();
      view.removeHoverbox = vi.fn();
    });

    describe('when event should expand story', function () {
      beforeEach(function () {
        view.eventShouldExpandStory = vi.fn();
        vi.spyOn(view, 'eventShouldExpandStory').mockImplementation(arg => {
          return arg === e ? true : undefined;
        });
      });

      it('sets the model attributes correctly', function () {
        view.startEdit(e);
        expect(view.model.set).toHaveBeenCalledWith({
          editing: true,
          editingDescription: false,
          clickFromSearchResult: false,
        });
      });

      it('removes the hoverBox', function () {
        view.startEdit(e);
        expect(view.removeHoverbox).toHaveBeenCalled();
      });
    });
  });

  describe('eventShouldExpandStory', function () {
    let e;

    beforeEach(function () {
      e = { target: '<input>' };
    });

    describe('when model is being edited', function () {
      beforeEach(function () {
        view.model.set({ editing: true });
      });

      it('returns false', function () {
        expect(view.eventShouldExpandStory(e)).toBeFalsy();
      });
    });

    describe('when model is not being edited', function () {
      beforeEach(function () {
        view.model.set({ editing: false });
      });

      describe('and e.target is an input', function () {
        it('returns false', function () {
          expect(view.eventShouldExpandStory(e)).toBeFalsy();
        });
      });

      describe('and e.target is not an input', function () {
        it('returns true', function () {
          e.target = '<span>';
          expect(view.eventShouldExpandStory(e)).toBeTruthy();
        });
      });
    });
  });

  describe('cancel edit', function () {
    it('should remove itself when edit cancelled if its new', function () {
      var view = new StoryView({ model: new_story });
      var spy = vi.spyOn(new_story, 'clear');

      view.cancelEdit();
      expect(spy).toHaveBeenCalled();
    });

    it('should reload after cancel if there were existing errors', function () {
      story.set({ errors: true });
      expect(story.get('errors')).toEqual(true);
      vi.spyOn(story, 'hasErrors').mockReturnValueOnce(true);
      var stub = vi.spyOn(story, 'fetch');
      view.cancelEdit();
      expect(stub).toHaveBeenCalled();
      expect(story.get('errors')).toBeUndefined();
    });
  });

  describe('save edit', function () {
    let e;

    beforeEach(function () {
      e = { currentTarget: '' };
    });

    afterEach(() => {
      server.resetHandlers();
    });

    it('should call save', async function () {
      server.use(
        http.put(url, () => {
          return HttpResponse.json(
            {
              story: { title: 'Story title' },
            },
            { status: 200 }
          );
        })
      );

      story.set({ editing: true });
      expect(view.model.get('editing')).toBeTruthy();

      await view.clickSave(e);

      expect(view.model.get('editing')).toBeFalsy();
    });

    it('should set editing when errors occur', async function () {
      server.use(
        http.put(url, () => {
          return HttpResponse.json(
            {
              story: { errors: { title: ['cannot be blank'] } },
            },
            { status: 422 }
          );
        })
      );

      view.clickSave(e);
      await new Promise(resolve => view.model.once('change:editing', resolve));

      expect(story.get('editing')).toBeTruthy();
      expect(story.get('errors').title[0]).toEqual('cannot be blank');
    });

    it('should disable all form controls on submit', async function () {
      server.use(
        http.put(url, () => {
          return HttpResponse.json(
            {
              story: { title: 'Story title' },
            },
            { status: 200 }
          );
        })
      );
      var disable_spy = vi.spyOn(view, 'disableForm');
      var enable_spy = vi.spyOn(view, 'enableForm');

      story.set({ editing: true });

      expect(enable_spy).not.toHaveBeenCalled();

      await view.clickSave(e);

      expect(disable_spy).toHaveBeenCalled();
      expect(enable_spy).toHaveBeenCalled();
    });

    it('should disable state transition buttons on click', async function () {
      server.use(
        http.put(url, () => {
          return HttpResponse.json(
            {
              story: { state: 'started' },
            },
            { status: 200 }
          );
        })
      );
      var ev = { target: { value: 'start' } };
      await view.transition(ev);

      expect(view.saveInProgress).toBeFalsy();
    });

    it('should disable estimate buttons on click', async function () {
      server.use(
        http.put(url, () => {
          return HttpResponse.json(
            {
              story: { estimate: '1' },
            },
            { status: 200 }
          );
        })
      );
      var ev = { target: { attributes: { 'data-value': { value: 1 } } } };
      await view.estimate(ev);

      expect(view.saveInProgress).toBeFalsy();
    });

    it('should call setAcceptedAt on the story', function () {
      view.saveEdit(e);
      expect(story.setAcceptedAt).toHaveBeenCalledOnce();
    });
  });

  describe('expand collapse controls', function () {
    it('should not show the collapse control if its a new story', function () {
      new_story.set({ editing: true });

      expect($(new_story_view.el)).not.toContain('a.collapse');
    });
  });

  describe('sorting', function () {
    beforeEach(function () {
      story.collection.length = 1;
      story.collection.columns = function () {
        return [];
      };
      story.collection.project.columnsBefore = vi.fn();
      story.collection.project.columnsAfter = vi.fn();
    });

    it('sets state to unstarted if dropped on the backlog column', function () {
      story.set({ state: 'unscheduled' });

      var html = $('<td id="backlog"><div id="story-1"></div></td>');
      var ev = { target: html.find('#story-1') };

      view.sortUpdate(ev);

      expect(story.get('state')).toEqual('unstarted');
    });

    it('sets state to unstarted if dropped on the in_progress column', function () {
      story.set({ state: 'unscheduled' });

      var html = $('<td id="in_progress"><div id="story-1"></div></td>');
      var ev = { target: html.find('#story-1') };

      view.sortUpdate(ev);

      expect(story.get('state')).toEqual('unstarted');
    });

    it("doesn't change state if not unscheduled and dropped on the in_progress column", function () {
      story.set({ state: 'finished' });

      var html = $('<td id="in_progress"><div id="story-1"></div></td>');
      var ev = { target: html.find('#story-1') };

      view.sortUpdate(ev);

      expect(story.get('state')).toEqual('finished');
    });

    it('sets state to unscheduled if dropped on the chilly_bin column', function () {
      story.set({ state: 'unstarted' });

      var html = $('<td id="chilly_bin"><div id="story-1"></div></td>');
      var ev = { target: html.find('#story-1') };

      view.sortUpdate(ev);

      expect(story.get('state')).toEqual('unscheduled');
    });

    it('should move after the previous story in the column', function () {
      var html = $(
        '<div id="story-1" data-story-id="1" class="story"></div><div id="story-2" data-story-id="2" class="story"></div>'
      );
      var ev = { target: html[1] };

      story.moveAfter = vi.fn();
      view.sortUpdate(ev);

      expect(story.moveAfter).toHaveBeenCalledWith(1);
    });

    it('should move before the next story in the column', function () {
      var html = $(
        '<div id="story-1" data-story-id="1" class="story"></div><div id="story-2" data-story-id="2" class="story"></div>'
      );
      var ev = { target: html[0] };

      story.moveBefore = vi.fn();
      view.sortUpdate(ev);

      expect(story.moveBefore).toHaveBeenCalledWith(2);
    });

    it('should move before the next story in the column', function () {
      var html = $(
        '<div id="foo"></div><div id="story-1" data-story-id="1" class="story"></div><div id="story-2" data-story-id="2" class="story"></div>'
      );
      var ev = { target: html[1] };

      story.moveBefore = vi.fn();
      view.sortUpdate(ev);

      expect(story.moveBefore).toHaveBeenCalledWith(2);
    });

    it('should move into an empty chilly bin', function () {
      var html = $(
        '<td id="backlog"><div id="story-1" data-story-id="1"></div></td><td id="chilly_bin"><div id="story-2" data-story-id="2"></div></td>'
      );
      var ev = { target: html.find('#story-2') };

      story.moveAfter = vi.fn();
      view.sortUpdate(ev);

      expect(story.get('state')).toEqual('unscheduled');
    });
  });

  describe('labels', function () {
    it('should initialize tagit on edit', function () {
      var spy = vi.spyOn(jQuery.fn, 'tagit');
      new_story.set({ editing: true });
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('notes', function () {
    it('adds a blank note to the end of the notes collection', function () {
      view.model.notes.reset();
      expect(view.model.notes.length).toEqual(0);
      view.addEmptyNote();
      expect(view.model.notes.length).toEqual(1);
      expect(view.model.notes.last().isNew()).toBeTruthy();
    });

    describe('when the text area is empty', function () {
      it('disables the add button', function () {
        view.canEdit = vi.fn().mockReturnValueOnce(true);
        view.render();

        expect(view.$('.add-note').is(':disabled')).toEqual(true);
      });
    });

    it("doesn't add a blank note if the story is new", function () {
      var stub = vi.spyOn(view.model, 'isNew');
      stub.mockReturnValueOnce(true);
      view.model.notes.reset();
      expect(view.model.notes.length).toEqual(0);
      view.addEmptyNote();
      expect(view.model.notes.length).toEqual(0);
    });

    it("doesn't add a blank note if there is already one", function () {
      view.model.notes.last = vi.fn().mockImplementation(() => ({
        isNew: vi.fn().mockReturnValue(true),
      }));
      expect(view.model.notes.last().isNew()).toBeTruthy();
      var oldLength = view.model.notes.length;
      view.addEmptyNote();
      expect(view.model.notes.length).toEqual(oldLength);
    });

    it('has a note deletion handler', function () {
      const note = { destroy: vi.fn() };
      view.handleNoteDelete(note);
      expect(note.destroy).toHaveBeenCalled();
    });

    it('has a <NoteForm /> save handler', function () {
      const note = { set: vi.fn(), save: vi.fn() };
      view.handleNoteSubmit({ note, newValue: 'TestNote' });
      expect(note.save).toHaveBeenCalled();
    });
  });

  describe('tasks', function () {
    it('adds a blank task to the end of the tasks collection', function () {
      view.model.tasks.reset();
      expect(view.model.tasks.length).toEqual(0);
      view.addEmptyTask();
      expect(view.model.tasks.length).toEqual(1);
      expect(view.model.tasks.last().isNew()).toBeTruthy();
    });

    it('disables the add button if the input is empty', function () {
      view.canEdit = vi.fn().mockReturnValueOnce(true);
      view.render();

      expect(view.$('.add-task').is(':disabled')).toEqual(true);
    });

    it("doesn't add a blank task if the story is new", function () {
      var stub = vi.spyOn(view.model, 'isNew');
      stub.mockReturnValueOnce(true);
      view.model.tasks.reset();
      expect(view.model.tasks.length).toEqual(0);
      view.addEmptyTask();
      expect(view.model.tasks.length).toEqual(0);
    });

    it("doesn't add a blank task if there is already one", function () {
      view.model.tasks.last = vi.fn().mockReturnValueOnce({
        isNew: vi.fn().mockReturnValueOnce(true),
      });
      expect(view.model.tasks.last().isNew()).toBeTruthy();
      var oldLength = view.model.tasks.length;
      view.addEmptyNote();
      expect(view.model.tasks.length).toEqual(oldLength);
    });

    it('has a task deletion handler', function () {
      const task = { destroy: vi.fn() };
      view.handleTaskDelete(task);
      expect(task.destroy).toHaveBeenCalled();
    });

    it('has a <TaskForm /> submit handler', function () {
      const task = { set: vi.fn(), save: vi.fn() };
      view.handleTaskSubmit({ task, taskName: 'TestTask' });
      expect(task.save).toHaveBeenCalled();
    });
  });

  describe('description', function () {
    beforeEach(function () {
      view.model.set({ editing: true });
      view.canEdit = vi.fn().mockReturnValueOnce(true);
    });

    afterEach(function () {
      view.model.set({ editing: false });
    });

    it('is text area when story is new', function () {
      view.model.isNew = vi.fn().mockReturnValueOnce(true);
      view.canEdit = vi.fn().mockReturnValueOnce(true);
      view.render();
      expect(view.$('textarea[name="description"]').length).toEqual(1);
      expect(view.$('.description').length).toEqual(0);
    });

    it("is text when story isn't new and description isn't empty", function () {
      window.md.makeHtml.mockReturnValueOnce('<p>foo</p>');
      view.model.isNew = vi.fn().mockReturnValueOnce(false);
      const innerText = 'foo';
      view.model.set({ description: innerText });
      view.render();
      expect(window.md.makeHtml).toHaveBeenCalledWith('foo');
      expect(view.$('textarea[name="description"]').length).toEqual(0);
      expect(view.$('.description').text()).toContain(innerText);
    });

    it("is a button when story isn't new and description is empty", function () {
      view.model.isNew = vi.fn().mockReturnValueOnce(false);
      view.model.set({ description: '' });
      view.render();
      expect(
        view.$('input[name="edit-description"][type="button"]').length
      ).toEqual(1);
    });

    it('is a text area after .edit-description is clicked', function () {
      const ev = { target: view.$('div.story-description')[0] };
      view.model.isNew = vi.fn().mockReturnValueOnce(false);
      view.editDescription(ev);
      expect(view.model.get('editingDescription')).toBeTruthy();
    });

    it('When onChange is triggered should properly set description value', function () {
      const value = 'foo';
      view.onChangeModel(value, 'description');
      expect(view.model.get('description')).toEqual(value);
    });
  });

  describe('makeFormControl', function () {
    let div;

    beforeEach(function () {
      div = {};
      view.make = vi.fn().mockReturnValue(div);
    });

    it("calls make('div')", function () {
      view.makeFormControl();
      expect(view.make).toHaveBeenCalled();
    });

    it('returns the div', function () {
      expect(view.makeFormControl()).toBe(div);
    });

    it('invokes its callback', function () {
      var callback = vi.fn();
      view.makeFormControl(callback);
      expect(callback).toHaveBeenCalledWith(div);
    });

    describe('when passed an object', function () {
      let _jquery_append;
      let content;
      let appendSpy;

      beforeEach(function () {
        content = { name: 'foo', label: 'Foo', control: 'bar' };
        _jquery_append = jQuery.fn.append;
        appendSpy = vi.spyOn(jQuery.fn, 'append');
      });

      afterEach(function () {
        jQuery.fn.append = _jquery_append;
      });

      it('creates a label', function () {
        // var label = '<label for="foo">Foo</label>';
        // view.makeFormControl(content);
        // expect(appendSpy).toHaveBeenCalledWith(label);
        // expect(appendSpy).toHaveBeenCalledWith('<br/>');
      });

      it('appends the control', function () {
        // view.makeFormControl(content);
        // expect(appendSpy).toHaveBeenCalledWith(content.control);
      });
    });
  });

  describe('disableEstimate', function () {
    it('disables estimate field when story is not estimable', function () {
      view.model.notEstimable = vi.fn().mockReturnValueOnce(true);
      view.canEdit = vi.fn().mockReturnValueOnce(true);
      view.render();

      expect(view.$('.story_estimate').is(':disabled')).toEqual(true);
    });
  });

  describe('confirms before finish', function () {
    let confirmStub;

    beforeEach(function () {
      confirmStub = vi.spyOn(window, 'confirm');
    });

    afterEach(function () {
      confirmStub.mockRestore();
    });

    describe('when accepting a story', function () {
      it('should save story when confirmed', function () {
        confirmStub.mockReturnValueOnce(true);

        story.set({ state: 'delivered' });

        var ev = { target: { value: 'accept' } };
        view.transition(ev);

        expect(story.get('state')).toEqual('accepted');
      });

      it('should not save story when not confirmed', function () {
        confirmStub.mockReturnValueOnce(false);

        story.set({ state: 'delivered' });

        var ev = { target: { value: 'accept' } };
        view.transition(ev);

        expect(story.get('state')).toEqual('delivered');
      });
    });

    describe('when rejecteing a story', function () {
      it('should save story when confirmed', function () {
        confirmStub.mockReturnValueOnce(true);

        story.set({ state: 'delivered' });

        var ev = { target: { value: 'reject' } };
        view.transition(ev);

        expect(story.get('state')).toEqual('rejected');
      });

      it('should not save story when not confirmed', function () {
        confirmStub.mockReturnValueOnce(false);

        story.set({ state: 'delivered' });

        var ev = { target: { value: 'reject' } };
        view.transition(ev);

        expect(story.get('state')).toEqual('delivered');
      });
    });
  });

  describe('toggleControlButtons', function () {
    var $storyControls;

    beforeEach(function () {
      view.canEdit = vi.fn().mockReturnValueOnce(true);
      view.render();
    });

    describe('it render a enabled', function () {
      beforeEach(function () {
        view.toggleControlButtons(false);
        $storyControls = view.$el.find('.story-controls');
      });

      it('submit button', function () {
        var submit = $storyControls.find('.submit');

        expect(submit.disabled).toBeFalsy();
      });

      it('cancel button', function () {
        var cancel = $storyControls.find('.cancel');

        expect(cancel.disabled).toBeFalsy();
      });

      it('destroy button', function () {
        var destroy = $storyControls.find('.destroy');

        expect(destroy.disabled).toBeFalsy();
      });
    });

    describe('it render a disabled', function () {
      beforeEach(function () {
        view.toggleControlButtons(true);
        $storyControls = view.$el.find('.story-controls');
      });

      it('submit button', function () {
        var submit = $storyControls.find('.submit');

        expect(submit.prop('disabled')).toBeTruthy();
      });

      it('cancel button', function () {
        var cancel = $storyControls.find('.cancel');

        expect(cancel.prop('disabled')).toBeTruthy();
      });

      it('destroy button', function () {
        var destroy = $storyControls.find('.submit');

        expect(destroy.prop('disabled')).toBeTruthy();
      });
    });
  });

  describe('handleSaveError', function () {
    let model;

    beforeEach(function () {
      model = { name: 'note', set: vi.fn() };
      const responseText = JSON.stringify({ note: { errors: 'Error' } });
      const response = { responseText };
      view.handleSaveError(model, response);
    });

    it('shows the errors', function () {
      expect(window.projectView.noticeSaveError).toHaveBeenCalledWith(model);
    });

    it("set the model's errors", function () {
      expect(model.set).toHaveBeenCalledWith({ errors: 'Error' });
    });
  });

  describe('transition buttons', function () {
    ['started', 'finished', 'delivered', 'rejected'].forEach(function (state) {
      describe(`when state is "${state}"`, function () {
        it('shows transition buttons', function () {
          story.set({ state });
          story.estimable = vi.fn().mockReturnValueOnce(false);
          view.render();

          expect(view.$el.html()).toContain('data-story-state-buttons');
        });
      });
    });

    describe('when state is "accepted"', function () {
      it('does not show transition buttons', function () {
        story.set({ state: 'accepted' });
        story.estimable = vi.fn().mockReturnValueOnce(false);
        view.render();

        expect(view.$el.html()).not.toContain('data-story-state-buttons');
      });

      it('does not show save or delete buttons', function () {
        var $storyControls;
        view.canEdit = vi.fn().mockReturnValueOnce(true);
        view.render();
        story.set({ state: 'accepted' });
        $storyControls = view.$el[0];

        expect($storyControls).not.toContain('.submit');
      });
    });
  });
});
