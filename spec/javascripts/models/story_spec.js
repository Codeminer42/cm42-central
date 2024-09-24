import Story from 'models/story';
import User from 'models/user';

describe('Story', function () {
  let story;
  let new_story;
  let ro_story;
  let server;

  beforeEach(function () {
    var Project = Backbone.Model.extend({
      name: 'project',
      defaults: { point_values: [0, 1, 2, 3] },
      users: { get: function () {} },
      current_user: new User({ id: 999, 'guest?': false }),
      currentIterationNumber: function () {
        return 1;
      },
      getIterationNumberForDate: function () {
        return 999;
      },
    });
    var collection = {
      project: new Project({}),
      url: '/foo',
      remove: function () {},
      get: function () {},
    };
    var view = new Backbone.View();
    story = new Story({
      id: 999,
      title: 'Test story',
      position: '2.45',
    });
    new_story = new Story({
      title: 'New story',
    });
    ro_story = new Story({
      id: 998,
      title: 'Readonly story',
      position: '2.55',
    });
    story.collection = new_story.collection = ro_story.collection = collection;
    story.view = new_story.view = ro_story.view = view;

    // the readonly flag is called in the initialize, but the state change depends on the collection, which in spec is set after the instance, so has to set manually here
    ro_story.set({ state: 'accepted', accepted_at: new Date() });
    ro_story.setReadonly();

    server = sinon.fakeServer.create();
  });

  describe('when instantiated', function () {
    it('should exhibit attributes', function () {
      expect(story.get('title')).toEqual('Test story');
    });

    it('should have a default state of unscheduled', function () {
      expect(story.get('state')).toEqual('unscheduled');
    });

    it('should have a default story type of feature', function () {
      expect(story.get('story_type')).toEqual('feature');
    });

    it('should have an empty array of events by default', function () {
      expect(story.get('events')).toEqual([]);
    });

    it('does not have a default release date setted', function () {
      expect(story.get('release_date')).toBeUndefined();
    });
  });

  describe('state transitions', function () {
    it('should start', function () {
      story.start();
      expect(story.get('state')).toEqual('started');
    });

    it('should finish', function () {
      story.finish();
      expect(story.get('state')).toEqual('finished');
    });

    it('should deliver', function () {
      story.deliver();
      expect(story.get('state')).toEqual('delivered');
    });

    it('should accept', function () {
      story.accept();
      expect(story.get('state')).toEqual('accepted');
    });

    it('should reject', function () {
      story.reject();
      expect(story.get('state')).toEqual('rejected');
    });

    it('should restart', function () {
      story.restart();
      expect(story.get('state')).toEqual('started');
    });
  });

  describe('events', function () {
    it('transitions from unscheduled', function () {
      story.set({ state: 'unscheduled' });
      expect(story.events()).toEqual(['start']);
    });
    it('transitions from unstarted', function () {
      story.set({ state: 'unstarted' });
      expect(story.events()).toEqual(['start']);
    });
    it('transitions from started', function () {
      story.set({ state: 'started' });
      expect(story.events()).toEqual(['finish']);
    });
    it('transitions from finished', function () {
      story.set({ state: 'finished' });
      expect(story.events()).toEqual(['deliver']);
    });
    it('transitions from delivered', function () {
      story.set({ state: 'delivered' });
      expect(story.events()).toEqual(['accept', 'reject']);
    });
    it('transitions from rejected', function () {
      story.set({ state: 'rejected' });
      expect(story.events()).toEqual(['restart']);
    });
    it('has no transitions from accepted', function () {
      story.set({ state: 'accepted' });
      expect(story.events()).toEqual([]);
    });
  });

  describe('setAcceptedAt', function () {
    it("should set accepted at to today's date when accepted", function () {
      var today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      expect(story.get('accepted_at')).toBeUndefined();
      story.accept();
      expect(new Date(story.get('accepted_at'))).toEqual(today);
    });

    it('should not set accepted at when accepted if already set', function () {
      story.set({ accepted_at: '2001/01/01' });
      story.accept();
      expect(story.get('accepted_at')).toEqual('2001/01/01');
    });
  });

  describe('estimable', function () {
    describe('when story is a feature', function () {
      beforeEach(function () {
        story.set({ story_type: 'feature' });
      });
      it('should be estimable when not estimated', function () {
        vi.spyOn(story, 'estimated').mockReturnValueOnce(false);
        expect(story.estimable()).toBeTruthy();
      });
      it('should not be estimable when estimated', function () {
        vi.spyOn(story, 'estimated').mockReturnValueOnce(true);
        expect(story.estimable()).toBeFalsy();
      });
    });

    describe('when story is not a feature', function () {
      it('should not be estimable', function () {
        story.set({ story_type: 'release' });
        expect(story.estimable()).toBeFalsy();
      });
    });
  });

  describe('estimated', function () {
    it('should say if it is estimated or not', function () {
      story.unset('estimate');
      expect(story.estimated()).toBeFalsy();
      story.set({ estimate: null });
      expect(story.estimated()).toBeFalsy();
      story.set({ estimate: 0 });
      expect(story.estimated()).toBeTruthy();
      story.set({ estimate: 1 });
      expect(story.estimated()).toBeTruthy();
    });
  });

  describe('notEstimable', function () {
    it('should not be estimable when story type is bug', function () {
      story.set({ story_type: 'bug' });

      expect(story.notEstimable()).toBeTruthy();
    });

    it('should not be estimable when story type is chore', function () {
      story.set({ story_type: 'chore' });

      expect(story.notEstimable()).toBeTruthy();
    });

    it('should not be estimable when story type is release', function () {
      story.set({ story_type: 'release' });

      expect(story.notEstimable()).toBeTruthy();
    });

    it('should be estimable when story type is feature', function () {
      story.set({ story_type: 'feature' });

      expect(story.notEstimable()).toBeFalsy();
    });
  });

  describe('point_values', function () {
    it('should known about its valid points values', function () {
      expect(story.point_values()).toEqual([0, 1, 2, 3]);
    });
  });

  describe('class name', function () {
    it('should have a classes of story and story type', function () {
      story.set({ estimate: 1 });
      expect(story.className()).toEqual('story feature');
    });

    it('should have an unestimated class if unestimated', function () {
      expect(story.estimable()).toBeTruthy();
      expect(story.estimated()).toBeFalsy();
      expect(story.className()).toEqual('story feature unestimated');
    });
  });

  describe('position', function () {
    it('should get position as a float', function () {
      expect(story.position()).toEqual(2.45);
    });
  });

  describe('column', function () {
    it('should return the right column', function () {
      story.set({ state: 'unscheduled' });
      expect(story.column).toEqual('#chilly_bin');
      story.set({ state: 'unstarted' });
      expect(story.column).toEqual('#backlog');
      story.set({ state: 'started' });
      expect(story.column).toEqual('#in_progress');
      story.set({ state: 'delivered' });
      expect(story.column).toEqual('#in_progress');
      story.set({ state: 'rejected' });
      expect(story.column).toEqual('#in_progress');

      // If the story is accepted, but it's accepted_at date is within the
      // current iteration, it should be in the in_progress column, otherwise
      // it should be in the #done column
      story.set({ state: 'accepted' });
      vi.spyOn(story, 'iterationNumber').mockReturnValueOnce(1);
      story.collection.project.currentIterationNumber = vi
        .fn()
        .mockReturnValueOnce(2);
      expect(story.column).toEqual('#done');
      story.collection.project.currentIterationNumber.mockReturnValueOnce(1);
      story.collection.project.currentIterationNumber();
      story.setColumn();
      expect(story.column).toEqual('#in_progress');
    });
  });

  describe('clear', function () {
    it('should destroy itself and its view', function () {
      var modelStub = vi.spyOn(story, 'destroy');

      story.clear();

      expect(modelStub).toHaveBeenCalled();
    });
  });

  describe('errors', function () {
    it('should record errors', function () {
      expect(story.hasErrors()).toBeFalsy();
      expect(story.errorsOn('title')).toBeFalsy();

      story.set({
        errors: {
          title: ['cannot be blank', 'needs to be better'],
          estimate: ['is helluh unrealistic'],
        },
      });

      expect(story.hasErrors()).toBeTruthy();
      expect(story.errorsOn('title')).toBeTruthy();
      expect(story.errorsOn('position')).toBeFalsy();

      expect(story.errorMessages()).toEqual(
        'title cannot be blank, title needs to be better, estimate is helluh unrealistic'
      );
    });
  });

  describe('users', function () {
    it("should get it's owner", function () {
      // Should return undefined if the story does not have an owner
      var spy = vi.spyOn(story.collection.project.users, 'get');
      var owned_by = story.owned_by();
      expect(spy).toHaveBeenCalledWith(undefined);
      expect(owned_by).toBeUndefined();

      story.set({ owned_by_id: 999 });
      owned_by = story.owned_by();
      expect(spy).toHaveBeenCalledWith(999);
    });

    it('should get its requester', function () {
      // Should return undefined if the story does not have an owner
      const stub = vi
        .spyOn(story.collection.project.users, 'get')
        .mockImplementation(arg => {
          if (arg === undefined) {
            return undefined;
          }
          if (arg === 999) {
            return dummyUser;
          }
        });

      const dummyUser = {};

      let requested_by = story.requested_by();
      expect(stub).toHaveBeenCalledWith(undefined);
      expect(requested_by).toBeUndefined();

      story.set({ requested_by_id: 999 });
      requested_by = story.requested_by();
      expect(requested_by).toEqual(dummyUser);
      expect(stub).toHaveBeenCalledWith(999);
    });

    it('should return a readable created_at', function () {
      var timestamp = '2011/09/19 02:25:56 +0000';
      story.set({ created_at: timestamp });
      expect(story.created_at()).toBe(
        new Date(timestamp).format(story.timestampFormat)
      );
    });

    it('should be assigned to the current user when started', function () {
      expect(story.get('state')).toEqual('unscheduled');
      expect(story.owned_by()).toBeUndefined();

      story.set({ state: 'started' });

      expect(story.get('owned_by_id')).toEqual(999);
    });
  });

  describe('details', function () {
    // If the story has details other than the title, e.g. description
    it('should return true the story has a description', function () {
      expect(story.hasDetails()).toBeFalsy();

      story.set({ description: 'Test description' });

      expect(story.hasDetails()).toBeTruthy();
    });

    it('should return true if the story has saved notes', function () {
      expect(story.hasDetails()).toBeFalsy();
      story.hasNotes = vi.fn().mockReturnValueOnce(true);
      expect(story.hasDetails()).toBeTruthy();
    });
  });

  describe('iterations', function () {
    it('should return the iteration number for an accepted story', function () {
      story.collection.project.iterationNumber = vi
        .fn()
        .mockReturnValueOnce(999);
      story.set({ accepted_at: '2011/07/25', state: 'accepted' });
      expect(story.iterationNumber()).toEqual(999);
    });
  });

  describe('labels', function () {
    it('should return an empty array if labels undefined', function () {
      expect(story.get('labels')).toBeUndefined();
      expect(story.labels()).toEqual([]);
    });

    it('should return an array of labels', function () {
      story.set({ labels: 'foo,bar' });
      expect(story.labels()).toEqual(['foo', 'bar']);
    });

    it('should remove trailing and leading whitespace when spliting labels', function () {
      story.set({ labels: 'foo , bar , baz' });
      expect(story.labels()).toEqual(['foo', 'bar', 'baz']);
    });
  });

  describe('notes', function () {
    it('should default with an empty notes collection', function () {
      expect(story.notes.length).toEqual(0);
    });

    it('should set the right notes collection url', function () {
      expect(story.notes.url()).toEqual('/foo/999/notes');
    });

    it('should set a notes collection', function () {
      var story = new Story({
        notes: [{ note: { text: 'Dummy note' } }],
      });

      expect(story.notes.length).toEqual(1);
    });

    describe('hasNotes', function () {
      it('returns true if it has saved notes', function () {
        expect(story.hasNotes()).toBeFalsy();
        story.notes.add({ id: 999, note: 'Test note' });
        expect(story.hasNotes()).toBeTruthy();
      });

      it('returns false if it has unsaved notes', function () {
        story.notes.add({ note: 'Unsaved note' });
        expect(story.hasNotes()).toBeFalsy();
      });
    });
  });

  describe('humanAttributeName', function () {
    beforeEach(function () {
      vi.spyOn(I18n, 't').mockImplementation(arg => {
        if (arg === 'foo_bar') return 'Foo bar';
      });
    });

    afterEach(() => {
      I18n.t.mockRestore();
    });

    it('returns the translated attribute name', function () {
      expect(story.humanAttributeName('foo_bar')).toEqual('Foo bar');
    });

    it('strips of the id suffix', function () {
      expect(story.humanAttributeName('foo_bar_id')).toEqual('Foo bar');
    });
  });

  describe('isReadonly', function () {
    it('should not be read only', function () {
      expect(story.isReadonly).toBeFalsy();
    });
    it('should be read only', function () {
      expect(ro_story.isReadonly).toBeTruthy();
    });
  });

  describe('changeState', function () {
    describe('when story is started', function () {
      it('sets the owner to the current user', function () {
        story.set({ onwed_by_id: 123 });
        story.changeState(story, 'started');
        expect(story.get('owned_by_id')).toBe(999);
      });
    });

    describe('when story is not started', function () {
      it('does not change the owner', function () {
        story.changeState(story, 'finished');
        expect(story.get('owned_by_id')).toBe(undefined);
      });
    });
  });
});
