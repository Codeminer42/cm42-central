/* eslint backbone/defaults-on-top:"off" */
/* eslint no-underscore-dangle:"off" */
import StoryView from 'views/story_view';
import template from 'templates/story.ejs';
import OriginalStory from 'models/story';

describe('StoryView', () => {
  beforeEach(function () {
    window.projectView = {
      availableTags: [],
      notice: sinon.stub(),
      noticeSaveError: sinon.stub(),
    };
    window.md = { makeHtml: sinon.stub().returns('') };
    const Note = Backbone.Model.extend({
      name: 'note',
      humanAttributeName: sinon.stub(),
    });
    const Task = Backbone.Model.extend({
      name: 'task',
      humanAttributeName: sinon.stub(),
    });
    const NotesCollection = Backbone.Collection.extend({ model: Note });
    const TasksCollection = Backbone.Collection.extend({ model: Task });
    const Story = Backbone.Model.extend({
      name: 'story',
      defaults: { story_type: 'feature' },
      estimable() { return true; },
      estimated() { return false; },
      notEstimable() { return true; },
      point_values() { return [0, 1, 2]; },
      hasErrors() { return false; },
      errorsOn() { return false; },
      documents() {
        return [{
          file: {
            id: 25, public_id: 'ikhhkie4ygljblsleqie.diff', version: '1435342626', format: null, resource_type: 'raw', path: 'v1435342626/ikhhkie4ygljblsleqie.diff',
          },
        }, {
          file: {
            id: 26, public_id: 'zvjhfvramk76ebgvhioa.csv', version: '1435342608', format: null, resource_type: 'raw', path: 'v1435342608/zvjhfvramk76ebgvhioa.csv',
          },
        }, {
          file: {
            id: 27, public_id: 'rythcrivxemvnbyh5mjb', version: '1435346191', format: 'png', resource_type: 'image', path: 'v1435346191/rythcrivxemvnbyh5mjb.png',
          },
        }];
      },
      url: '/path/to/story',
      collection: { project: { users: { forSelect() { return []; } } } },
      start() { this.set({ state: 'started' }); },
      deliver() { this.set({ state: 'delivered' }); },
      accept() { this.set({ state: 'accepted' }); },
      reject() { this.set({ state: 'rejected' }); },
      hasDetails() { return true; },
      events: OriginalStory.prototype.events,
      humanAttributeName: sinon.stub(),
      setAcceptedAt: sinon.spy(),
      errorMessages: sinon.stub(),
      views: [],
      clickFromSearchResult: false,
      isSearchResult: false,
    });
    this.story = new Story({ id: '999', title: 'Story' });
    this.new_story = new Story({ title: 'New Story' });
    this.story.notes = this.new_story.notes = new NotesCollection();
    this.story.tasks = this.new_story.tasks = new TasksCollection();
    this.view = new StoryView({
      model: this.story,
    });
    this.new_story_view = new StoryView({
      model: this.new_story,
    });

    window.I18n = { t: sinon.stub() };
    window.projectView.usernames = sinon.stub();

    this.server = sinon.fakeServer.create();

    this.view.attachinaryOptions = {
      attachinary: {
        accessible: true, accept: ['raw', 'jpg', 'png', 'psd', 'docx', 'xlsx', 'doc', 'xls'], maximum: 10, single: false, scope: 'documents', plural: 'documents', singular: 'document', files: [],
      },
      cloudinary: {
        tags: ['development_env', 'attachinary_tmp'],
        use_filename: true,
      },
      html: {
        class: ['attachinary-input'],
        accept: 'image/jpeg,image/png,image/vnd.adobe.photoshop,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/excel',
        multiple: true,
        data: {
          attachinary: {
            accessible: true, accept: ['raw', 'jpg', 'png', 'psd', 'docx', 'xlsx', 'doc', 'xls'], maximum: 10, single: false, scope: 'documents', plural: 'documents', singular: 'document', files: [],
          },
          form_data: {
            timestamp: 1435347909, callback: 'http://localhost:3000/attachinary/cors', tags: 'development_env,attachinary_tmp', signature: 'db3b029ed02431b1dccac45cc8b2159a280fd334', api_key: '893592954749395',
          },
          url: 'https://api.cloudinary.com/v1_1/hq5e5afno/auto/upload',
        },
      },
    };
  });

  afterEach(function () {
    this.server.restore();
  });

  describe('class name', () => {
    it('should have the story class', function () {
      expect($(this.view.el)).toHaveClass('story');
    });

    it('should have the story type class', function () {
      expect($(this.view.el)).toHaveClass('feature');
    });

    it('should have the unestimated class', function () {
      expect($(this.view.el)).toHaveClass('unestimated');

      // Should not have the unestimated class if it's been estimated
      sinon.stub(this.view.model, 'estimated').returns(true);
      this.view.model.set({ estimate: 1 });
      expect($(this.view.el)).not.toHaveClass('unestimated');
    });

    it('should have the story state class', function () {
      expect($(this.view.el)).toHaveClass('unestimated');
      this.view.model.set({ state: 'accepted' });
      expect($(this.view.el)).toHaveClass('accepted');
    });
  });

  describe('id', () => {
    it('should have an id', function () {
      expect(this.view.id).toEqual(this.view.model.id);
      expect($(this.view.el)).toHaveId(`story-${this.view.model.id}`);
    });
  });

  describe('startEdit', () => {
    beforeEach(function () {
      this.e = {};
      this.view.model.set = sinon.stub();
      this.view.removeHoverbox = sinon.stub();
    });

    describe('when event should expand story', () => {
      beforeEach(function () {
        this.view.eventShouldExpandStory = sinon.stub();
        this.view.eventShouldExpandStory.withArgs(this.e).returns(true);
      });

      it('sets the model attributes correctly', function () {
        this.view.startEdit(this.e);
        expect(this.view.model.set).toHaveBeenCalledWith({
          editing: true, editingDescription: false, clickFromSearchResult: false,
        });
      });

      it('removes the hoverBox', function () {
        this.view.startEdit(this.e);
        expect(this.view.removeHoverbox).toHaveBeenCalled();
      });
    });
  });

  describe('eventShouldExpandStory', () => {
    beforeEach(function () {
      this.e = { target: '<input>' };
    });

    describe('when model is being edited', () => {
      beforeEach(function () {
        this.view.model.set({ editing: true });
      });

      it('returns false', function () {
        expect(this.view.eventShouldExpandStory(this.e)).toBeFalsy();
      });
    });

    describe('when model is not being edited', () => {
      beforeEach(function () {
        this.view.model.set({ editing: false });
      });

      describe('and e.target is an input', () => {
        it('returns false', function () {
          expect(this.view.eventShouldExpandStory(this.e)).toBeFalsy();
        });
      });

      describe('and e.target is not an input', () => {
        it('returns true', function () {
          this.e.target = '<span>';
          expect(this.view.eventShouldExpandStory(this.e)).toBeTruthy();
        });
      });
    });
  });

  describe('cancel edit', () => {
    it('should remove itself when edit cancelled if its new', function () {
      const view = new StoryView({ model: this.new_story });
      const spy = sinon.spy(this.new_story, 'clear');

      view.cancelEdit();
      expect(spy).toHaveBeenCalled();
    });

    it('should reload after cancel if there were existing errors', function () {
      this.story.set({ errors: true });
      expect(this.story.get('errors')).toEqual(true);
      sinon.stub(this.story, 'hasErrors').returns(true);
      const stub = sinon.stub(this.story, 'fetch');
      this.view.cancelEdit();
      expect(stub).toHaveBeenCalled();
      expect(this.story.get('errors')).toBeUndefined();
    });
  });

  describe('save edit', () => {
    beforeEach(function () {
      this.e = { currentTarget: '' };
    });

    it('should call save', function () {
      this.server.respondWith('PUT', '/path/to/story', [
        200, { 'Content-Type': 'application/json' },
        '{"story":{"title":"Story title"}}',
      ]);
      this.story.set({ editing: true });
      this.view.clickSave(this.e);
      expect(this.story.get('editing')).toBeTruthy();
      expect(this.server.requests.length).toEqual(1);

      // editing should be set to false when save is successful
      this.server.respond();

      expect(this.story.get('editing')).toBeFalsy();
    });

    it('should set editing when errors occur', function () {
      this.server.respondWith('PUT', '/path/to/story', [
        422, { 'Content-Type': 'application/json' },
        '{"story":{"errors":{"title":["cannot be blank"]}}}',
      ]);

      this.view.clickSave(this.e);
      expect(this.server.responses.length).toEqual(1);
      expect(this.server.responses[0].method).toEqual('PUT');
      expect(this.server.responses[0].url).toEqual('/path/to/story');

      this.server.respond();

      expect(this.story.get('editing')).toBeTruthy();
      expect(this.story.get('errors').title[0]).toEqual('cannot be blank');
    });

    it('should disable all form controls on submit', function () {
      this.server.respondWith('PUT', '/path/to/story', [
        200, { 'Content-Type': 'application/json' },
        '{"story":{"title":"Story title"}}',
      ]);

      const disable_spy = sinon.spy(this.view, 'disableForm');
      const enable_spy = sinon.spy(this.view, 'enableForm');

      this.story.set({ editing: true });
      this.view.clickSave(this.e);

      expect(disable_spy).toHaveBeenCalled();
      expect(enable_spy).not.toHaveBeenCalled();
      this.server.respond();

      expect(enable_spy).toHaveBeenCalled();
    });

    it('should disable state transition buttons on click', function () {
      this.server.respondWith('PUT', '/path/to/story', [
        200, { 'Content-Type': 'application/json' },
        '{"story":{"state":"started"}}',
      ]);

      const ev = { target: { value: 'start' } };
      this.view.transition(ev);

      expect(this.view.saveInProgress).toBeTruthy();

      this.server.respond();

      expect(this.view.saveInProgress).toBeFalsy();
    });

    it('should disable estimate buttons on click', function () {
      this.server.respondWith('PUT', '/path/to/story', [
        200, { 'Content-Type': 'application/json' },
        '{"story":{"estimate":"1"}}',
      ]);

      const ev = { target: { attributes: { 'data-value': { value: 1 } } } };
      this.view.estimate(ev);

      expect(this.view.saveInProgress).toBeTruthy();

      this.server.respond();

      expect(this.view.saveInProgress).toBeFalsy();
    });

    it('should call setAcceptedAt on the story', function () {
      this.view.saveEdit(this.e);
      expect(this.story.setAcceptedAt).toHaveBeenCalledOnce();
    });
  });

  describe('expand collapse controls', () => {
    it('should not show the collapse control if its a new story', function () {
      this.new_story.set({ editing: true });

      expect($(this.new_story_view.el)).not.toContain('a.collapse');
    });
  });

  describe('sorting', () => {
    beforeEach(function () {
      this.story.collection.length = 1;
      this.story.collection.columns = function () { return []; };
      this.story.collection.project.columnsBefore = sinon.stub();
      this.story.collection.project.columnsAfter = sinon.stub();
    });

    it('sets state to unstarted if dropped on the backlog column', function () {
      this.story.set({ state: 'unscheduled' });

      const html = $('<td id="backlog"><div id="story-1"></div></td>');
      const ev = { target: html.find('#story-1') };

      this.view.sortUpdate(ev);

      expect(this.story.get('state')).toEqual('unstarted');
    });

    it('sets state to unstarted if dropped on the in_progress column', function () {
      this.story.set({ state: 'unscheduled' });

      const html = $('<td id="in_progress"><div id="story-1"></div></td>');
      const ev = { target: html.find('#story-1') };

      this.view.sortUpdate(ev);

      expect(this.story.get('state')).toEqual('unstarted');
    });

    it("doesn't change state if not unscheduled and dropped on the in_progress column", function () {
      this.story.set({ state: 'finished' });

      const html = $('<td id="in_progress"><div id="story-1"></div></td>');
      const ev = { target: html.find('#story-1') };

      this.view.sortUpdate(ev);

      expect(this.story.get('state')).toEqual('finished');
    });

    it('sets state to unscheduled if dropped on the chilly_bin column', function () {
      this.story.set({ state: 'unstarted' });

      const html = $('<td id="chilly_bin"><div id="story-1"></div></td>');
      const ev = { target: html.find('#story-1') };

      this.view.sortUpdate(ev);

      expect(this.story.get('state')).toEqual('unscheduled');
    });

    it('should move after the previous story in the column', function () {
      const html = $('<div id="story-1" data-story-id="1" class="story"></div><div id="story-2" data-story-id="2" class="story"></div>');
      const ev = { target: html[1] };

      this.story.moveAfter = sinon.spy();
      this.view.sortUpdate(ev);

      expect(this.story.moveAfter).toHaveBeenCalledWith(1);
    });

    it('should move before the next story in the column', function () {
      const html = $('<div id="story-1" data-story-id="1" class="story"></div><div id="story-2" data-story-id="2" class="story"></div>');
      const ev = { target: html[0] };

      this.story.moveBefore = sinon.spy();
      this.view.sortUpdate(ev);

      expect(this.story.moveBefore).toHaveBeenCalledWith(2);
    });

    it('should move before the next story in the column', function () {
      const html = $('<div id="foo"></div><div id="story-1" data-story-id="1" class="story"></div><div id="story-2" data-story-id="2" class="story"></div>');
      const ev = { target: html[1] };

      this.story.moveBefore = sinon.spy();
      this.view.sortUpdate(ev);

      expect(this.story.moveBefore).toHaveBeenCalledWith(2);
    });

    it('should move into an empty chilly bin', function () {
      const html = $('<td id="backlog"><div id="story-1" data-story-id="1"></div></td><td id="chilly_bin"><div id="story-2" data-story-id="2"></div></td>');
      const ev = { target: html.find('#story-2') };

      this.story.moveAfter = sinon.spy();
      this.view.sortUpdate(ev);

      expect(this.story.get('state')).toEqual('unscheduled');
    });
  });

  describe('labels', () => {
    it('should initialize tagit on edit', function () {
      const spy = sinon.spy(jQuery.fn, 'tagit');
      this.new_story.set({ editing: true });
      expect(spy).toHaveBeenCalled();
      spy.restore();
    });
  });

  describe('notes', () => {
    it('adds a blank note to the end of the notes collection', function () {
      this.view.model.notes.reset();
      expect(this.view.model.notes.length).toEqual(0);
      this.view.addEmptyNote();
      expect(this.view.model.notes.length).toEqual(1);
      expect(this.view.model.notes.last().isNew()).toBeTruthy();
    });

    it("doesn't add a blank note if the story is new", function () {
      const stub = sinon.stub(this.view.model, 'isNew');
      stub.returns(true);
      this.view.model.notes.reset();
      expect(this.view.model.notes.length).toEqual(0);
      this.view.addEmptyNote();
      expect(this.view.model.notes.length).toEqual(0);
    });

    it("doesn't add a blank note if there is already one", function () {
      this.view.model.notes.last = sinon.stub().returns({
        isNew: sinon.stub().returns(true),
      });
      expect(this.view.model.notes.last().isNew()).toBeTruthy();
      const oldLength = this.view.model.notes.length;
      this.view.addEmptyNote();
      expect(this.view.model.notes.length).toEqual(oldLength);
    });

    it('has a note deletion handler', function () {
      const note = { destroy: sinon.stub() };
      this.view.handleNoteDelete(note);
      expect(note.destroy).toHaveBeenCalled();
    });

    it('has a <NoteForm /> save handler', function () {
      const note = { set: sinon.stub(), save: sinon.stub() };
      this.view.handleNoteSubmit({ note, newValue: 'TestNote' });
      expect(note.save).toHaveBeenCalled();
    });
  });

  describe('tasks', () => {
    it('adds a blank task to the end of the tasks collection', function () {
      this.view.model.tasks.reset();
      expect(this.view.model.tasks.length).toEqual(0);
      this.view.addEmptyTask();
      expect(this.view.model.tasks.length).toEqual(1);
      expect(this.view.model.tasks.last().isNew()).toBeTruthy();
    });

    it("doesn't add a blank task if the story is new", function () {
      const stub = sinon.stub(this.view.model, 'isNew');
      stub.returns(true);
      this.view.model.tasks.reset();
      expect(this.view.model.tasks.length).toEqual(0);
      this.view.addEmptyTask();
      expect(this.view.model.tasks.length).toEqual(0);
    });

    it("doesn't add a blank task if there is already one", function () {
      this.view.model.tasks.last = sinon.stub().returns({
        isNew: sinon.stub().returns(true),
      });
      expect(this.view.model.tasks.last().isNew()).toBeTruthy();
      const oldLength = this.view.model.tasks.length;
      this.view.addEmptyNote();
      expect(this.view.model.tasks.length).toEqual(oldLength);
    });

    it('has a task deletion handler', function () {
      const task = { destroy: sinon.stub() };
      this.view.handleTaskDelete(task);
      expect(task.destroy).toHaveBeenCalled();
    });

    it('has a <TaskForm /> submit handler', function () {
      const task = { set: sinon.stub(), save: sinon.stub() };
      this.view.handleTaskSubmit({ task, taskName: 'TestTask' });
      expect(task.save).toHaveBeenCalled();
    });
  });

  describe('description', () => {
    beforeEach(function () {
      this.view.model.set({ editing: true });
    });

    afterEach(function () {
      this.view.model.set({ editing: false });
    });

    it('is text area when story is new', function () {
      this.view.model.isNew = sinon.stub().returns(true);
      this.view.canEdit = sinon.stub().returns(true);
      this.view.render();
      expect(this.view.$('textarea[name="description"]').length).toEqual(1);
      expect(this.view.$('.description').length).toEqual(0);
    });

    it("is text when story isn't new and description isn't empty", function () {
      window.md.makeHtml.returns('<p>foo</p>');
      this.view.model.isNew = sinon.stub().returns(false);
      const innerText = 'foo';
      this.view.model.set({ description: innerText });
      this.view.render();
      expect(window.md.makeHtml).toHaveBeenCalledWith('foo');
      expect(this.view.$('textarea[name="description"]').length).toEqual(0);
      expect(this.view.$('.description')[0].innerText).toContain(innerText);
    });

    it("is a button when story isn't new and description is empty", function () {
      this.view.model.isNew = sinon.stub().returns(false);
      this.view.model.set({ description: '' });
      this.view.render();
      expect(this.view.$('input[name="edit-description"][type="button"]').length).toEqual(1);
    });

    it('is a text area after .edit-description is clicked', function () {
      const ev = { target: this.view.$('div.story-description')[0] };
      this.view.model.isNew = sinon.stub().returns(false);
      this.view.editDescription(ev);
      expect(this.view.model.get('editingDescription')).toBeTruthy();
    });

    it('When onChange is triggered should properly set description value', function () {
      const value = 'foo';
      this.view.onChangeModel(value, 'description');
      expect(this.view.model.get('description')).toEqual(value);
    });
  });

  describe('attachinary', () => {
    beforeEach(function () {
      this.view.model.set({ editing: true });
      this.view.trigger('attachmentOptions', {
        attachinary: {
          accessible: true,
          accept: ['raw', 'jpg', 'png', 'psd', 'docx', 'xlsx', 'doc', 'xls'],
          maximum: 10,
          single: false,
          scope: 'documents',
          plural: 'documents',
          singular: 'document',
          files: [],
        },
        cloudinary: {
          tags: ['development_env', 'attachinary_tmp'],
          use_filename: true,
        },
        html: {
          class: ['attachinary-input'],
          accept: 'image/jpeg,image/png,image/vnd.adobe.photoshop,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/excel',
          multiple: true,
          data: {
            attachinary: {
              accessible: true,
              accept: ['raw', 'jpg', 'png', 'psd', 'docx', 'xlsx', 'doc', 'xls'],
              maximum: 10,
              single: false,
              scope: 'documents',
              plural: 'documents',
              singular: 'document',
              files: [],
            },
            form_data: {
              timestamp: 1435347909,
              callback: 'http://localhost:3000/attachinary/cors',
              tags: 'development_env,attachinary_tmp',
              signature: 'db3b029ed02431b1dccac45cc8b2159a280fd334',
              api_key: '893592954749395',
            },
            url: 'https://api.cloudinary.com/v1_1/hq5e5afno/auto/upload',
          },
        },
      });
    });

    afterEach(function () {
      this.view.model.set({ editing: false });
    });

    it('has its element defined when story is new', function () {
      this.view.model.isNew = sinon.stub().returns(true);
      this.view.render();
      expect(this.view.$('.attachinary-input').length).toEqual(1);
      expect(this.view.$('.attachinary-input').siblings().length).toEqual(3);
      expect(this.view.$('.attachinary-input').siblings()[1].id).toContain('documents_progress');
      expect(this.view.$('.attachinary-input').siblings()[2].id).toContain('attachinary_container');
    });
  });

  describe('makeFormControl', () => {
    beforeEach(function () {
      this.div = {};
      this.view.make = sinon.stub().returns(this.div);
    });

    it("calls make('div')", function () {
      this.view.makeFormControl();
      expect(this.view.make).toHaveBeenCalled();
    });

    it('returns the div', function () {
      expect(this.view.makeFormControl()).toBe(this.div);
    });

    it('invokes its callback', function () {
      const callback = sinon.stub();
      this.view.makeFormControl(callback);
      expect(callback).toHaveBeenCalledWith(this.div);
    });

    describe('when passed an object', () => {
      beforeEach(function () {
        this.content = { name: 'foo', label: 'Foo', control: 'bar' };
        this._jquery_append = jQuery.fn.append;
        this.appendSpy = spyOn(jQuery.fn, 'append');
      });

      afterEach(function () {
        jQuery.fn.append = this._jquery_append;
      });

      it('creates a label', function () {
        const label = '<label for="foo">Foo</label>';
        const stub = sinon.stub(this.view, 'label').withArgs('foo').returns(label);
        this.view.makeFormControl(this.content);
        expect(this.appendSpy).toHaveBeenCalledWith(label);
        expect(this.appendSpy).toHaveBeenCalledWith('<br/>');
      });

      it('appends the control', function () {
        this.view.makeFormControl(this.content);
        expect(this.appendSpy).toHaveBeenCalledWith(this.content.control);
      });
    });
  });

  describe('disableEstimate', () => {
    it('disables estimate field when story is not estimable', function () {
      this.view.model.notEstimable = sinon.stub().returns(true);
      this.view.canEdit = sinon.stub().returns(true);
      this.view.render();

      expect(this.view.$('.story_estimate')).toBeDisabled();
    });
  });

  describe('confirms before finish', () => {
    beforeEach(function () {
      this.confirmStub = sinon.stub(window, 'confirm');
    });

    afterEach(function () {
      this.confirmStub.restore();
    });

    describe('when accepting a story', () => {
      it('should save story when confirmed', function () {
        this.confirmStub.returns(true);

        this.story.set({ state: 'delivered' });

        const ev = { target: { value: 'accept' } };
        this.view.transition(ev);

        expect(this.story.get('state')).toEqual('accepted');
      });

      it('should not save story when not confirmed', function () {
        this.confirmStub.returns(false);

        this.story.set({ state: 'delivered' });

        const ev = { target: { value: 'accept' } };
        this.view.transition(ev);

        expect(this.story.get('state')).toEqual('delivered');
      });
    });

    describe('when rejecteing a story', () => {
      it('should save story when confirmed', function () {
        this.confirmStub.returns(true);

        this.story.set({ state: 'delivered' });

        const ev = { target: { value: 'reject' } };
        this.view.transition(ev);

        expect(this.story.get('state')).toEqual('rejected');
      });

      it('should not save story when not confirmed', function () {
        this.confirmStub.returns(false);

        this.story.set({ state: 'delivered' });

        const ev = { target: { value: 'reject' } };
        this.view.transition(ev);

        expect(this.story.get('state')).toEqual('delivered');
      });
    });
  });

  describe('attachmentDone', () => {
    describe('when the story is new', () => {
      it('never calls saveEdit', function () {
        this.view.model.isNew = sinon.stub().returns(true);
        this.view.saveEdit = sinon.stub();

        this.view.attachmentDone();

        expect(this.view.saveEdit).not.toHaveBeenCalled();
      });
    });

    describe('when the story is not new', () => {
      it('calls saveEdit', function () {
        this.view.model.isNew = sinon.stub().returns(false);
        this.view.saveEdit = sinon.stub();

        this.view.attachmentDone();

        expect(this.view.saveEdit).toHaveBeenCalled();
      });
    });
  });

  describe('attachmentStart', () => {
    describe('while the attachment is happening', () => {
      it('call toggleControlButtons', function () {
        spyOn(this.view, 'toggleControlButtons');
        this.view.attachmentStart();
        expect(this.view.toggleControlButtons).toHaveBeenCalled();
      });
    });
  });

  describe('attachmentFail', () => {
    describe('when the attachment has failed to upload', () => {
      it('call toggleControlButtons', function () {
        spyOn(this.view, 'toggleControlButtons');
        this.view.attachmentFail();
        expect(this.view.toggleControlButtons).toHaveBeenCalled();
      });
    });
  });

  describe('toggleControlButtons', () => {
    let $storyControls;

    beforeEach(function () {
      this.view.canEdit = sinon.stub().returns(true);
      this.view.render();
    });

    describe('it render a enabled', () => {
      beforeEach(function () {
        this.view.toggleControlButtons(false);
        $storyControls = this.view.$el.find('.story-controls');
      });

      it('submit button', () => {
        const submit = $storyControls.find('.submit');

        expect(submit.disabled).toBeFalsy();
      });

      it('cancel button', () => {
        const cancel = $storyControls.find('.cancel');

        expect(cancel.disabled).toBeFalsy();
      });

      it('destroy button', () => {
        const destroy = $storyControls.find('.submit');

        expect(destroy.disabled).toBeFalsy();
      });
    });

    describe('it render a disabled', () => {
      beforeEach(function () {
        this.view.toggleControlButtons(true);
        $storyControls = this.view.$el.find('.story-controls');
      });

      it('submit button', () => {
        const submit = $storyControls.find('.submit');

        expect(submit.prop('disabled')).toBeTruthy();
      });

      it('cancel button', () => {
        const cancel = $storyControls.find('.cancel');

        expect(cancel.prop('disabled')).toBeTruthy();
      });

      it('destroy button', () => {
        const destroy = $storyControls.find('.submit');

        expect(destroy.prop('disabled')).toBeTruthy();
      });
    });
  });

  describe('handleSaveError', () => {
    let model;

    beforeEach(function () {
      model = { name: 'note', set: sinon.stub() };
      const responseText = JSON.stringify({ note: { errors: 'Error' } });
      const response = { responseText };
      this.view.handleSaveError(model, response);
    });

    it('shows the errors', () => {
      expect(window.projectView.noticeSaveError).toHaveBeenCalledWith(model);
    });

    it("set the model's errors", () => {
      expect(model.set).toHaveBeenCalledWith({ errors: 'Error' });
    });
  });

  describe('transition buttons', () => {
    ['started', 'finished', 'delivered', 'rejected'].forEach((state) => {
      describe(`when state is "${state}"`, () => {
        it('shows transition buttons', function () {
          this.story.set({ state });
          this.story.estimable = sinon.stub().returns(false);
          this.view.render();

          expect(this.view.$el.html()).toContain('data-story-state-buttons');
        });
      });
    });

    describe('when state is "accepted"', () => {
      it('does not show transition buttons', function () {
        this.story.set({ state: 'accepted' });
        this.story.estimable = sinon.stub().returns(false);
        this.view.render();

        expect(this.view.$el.html()).not.toContain('data-story-state-buttons');
      });
    });
  });
});
