import * as Story from 'models/beta/story';
import moment from 'moment';
import { status } from 'libs/beta/constants';

describe('Story model', function () {
  describe('comparePosition', () => {

    describe('when position A is bigger then B', () => {
      it("return 1", () => {
        const storyA = {
          position: "10.7"
        };

        const storyB = {
          position: "4.3"
        }

        expect(Story.comparePosition(storyA, storyB)).toEqual(1)
      });
    });

    describe('when position A is lower then B', () => {
      it("return -1", () => {
        const storyA = {
          position: "3.4"
        };

        const storyB = {
          position: "5.3"
        }

        expect(Story.comparePosition(storyA, storyB)).toEqual(-1)
      });
    });

    describe('when position A is equal B', () => {
      it("return 0", () => {
        const storyA = {
          position: "5.0"
        };

        const storyB = {
          position: "5.0"
        }

        expect(Story.comparePosition(storyA, storyB)).toEqual(0)
      });
    });

  });

  describe('compareAcceptedAt', () => {

    describe('when date A is more recent then B', () => {
      it("return 1", () => {
        const storyA = {
          acceptedAt: "2018-08-07T16:36:20.811Z"
        };

        const storyB = {
          acceptedAt: "2018-08-06T16:36:20.811Z"
        }

        expect(Story.compareAcceptedAt(storyA, storyB)).toEqual(1)
      });
    });

    describe('when date A is older then B', () => {
      it("return -1", () => {
        const storyA = {
          acceptedAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          acceptedAt: "2018-08-07T16:36:20.811Z"
        }

        expect(Story.compareAcceptedAt(storyA, storyB)).toEqual(-1)
      });
    });

    describe('when date A is equal B', () => {
      it("return 0", () => {
        const storyA = {
          acceptedAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          acceptedAt: "2018-08-07T12:36:20.811Z"
        }

        expect(Story.compareAcceptedAt(storyA, storyB)).toEqual(0)
      });
    });

  });

  describe('compareStarteddAt', () => {

    describe('when date A is more recent then B', () => {
      it("return 1", () => {
        const storyA = {
          startedAt: "2018-08-07T16:36:20.811Z"
        };

        const storyB = {
          startedAt: "2018-08-06T16:36:20.811Z"
        }

        expect(Story.compareStartedAt(storyA, storyB)).toEqual(1)
      });
    });

    describe('when date A is older then B', () => {
      it("return -1", () => {
        const storyA = {
          startedAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          startedAt: "2018-08-07T16:36:20.811Z"
        }

        expect(Story.compareStartedAt(storyA, storyB)).toEqual(-1)
      });
    });

    describe('when date A is equal B', () => {
      it("return 0", () => {
        const storyA = {
          startedAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          startedAt: "2018-08-07T12:36:20.811Z"
        }

        expect(Story.compareStartedAt(storyA, storyB)).toEqual(0)
      });
    });

  });

  describe('compareDeliveredAt', () => {

    describe('when date A is more recent then B', () => {
      it("return 1", () => {
        const storyA = {
          deliveredAt: "2018-08-07T16:36:20.811Z"
        };

        const storyB = {
          deliveredAt: "2018-08-06T16:36:20.811Z"
        }

        expect(Story.compareDeliveredAt(storyA, storyB)).toEqual(1)
      });
    });

    describe('when date A is older then B', () => {
      it("return -1", () => {
        const storyA = {
          deliveredAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          deliveredAt: "2018-08-07T16:36:20.811Z"
        }

        expect(Story.compareDeliveredAt(storyA, storyB)).toEqual(-1)
      });
    });

    describe('when date A is equal B', () => {
      it("return 0", () => {
        const storyA = {
          deliveredAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          deliveredAt: "2018-08-07T12:36:20.811Z"
        }

        expect(Story.compareDeliveredAt(storyA, storyB)).toEqual(0)
      });
    });

    describe('is unestimated feature', () => {
      it('return a story if it is a feature and is unestimated', () => {
        const stories = [
          {
            id: 10,
            storyType: 'feature',
            estimate: null,
          },
          {
            id: 20,
            storyType: 'bug',
            estimate: null,
          },
          {
            id: 30,
            storyType: 'feature',
            estimate: 2,
          },
        ];

        const unestimated = stories.filter(Story.isUnestimatedFeature);

        expect(unestimated.length).toEqual(1);
        expect(unestimated[0].id).toEqual(10);
      });
    });
  });

  describe('toggleStory', () => {
    describe('When story is collapsed', () => {
      it('sets collapsed to false and copies the previous state to a _editing field', () => {
        const story = { collapsed: true };

        const expandedStory = Story.toggleStory(story);

        expect(expandedStory).toEqual({
          collapsed: false,
          _editing: {
            collapsed: true,
            loading: false,
            _isDirty: false
          }
        });
      });
    });

    describe('When story is expanded', () => {
      it('sets collapsed to true and sets _editing field to null', () => {
        const story = { collapsed: false };

        const collapsedStory = Story.toggleStory(story);

        expect(collapsedStory).toEqual({
          collapsed: true,
          _editing: null
        });
      });
    });
  });

  describe('editStory', () => {
    it('change story type and sets _isDirty to true', () => {
      const story = {
        estimate: '',
        _editing: {
          labels: [],
          storyType: 'bug',
          estimate: ''
        }
      };
      const newAttributes = { storyType: 'feature' };

      const changedStory = Story.editStory(story, newAttributes);

      expect(changedStory).toEqual({
        estimate: '',
        _editing: {
          labels: [],
          storyType: newAttributes.storyType,
          estimate: '',
          _isDirty: true
        }
      });
    });

    const notFeatureTypes = ['bug', 'release', 'chore'];

    notFeatureTypes.forEach(type => {
      it(`change story estimate to null when storyType is ${type} and sets _isDirty to true`, () => {
        const story = { _editing: { storyType: 'feature' } };
        const newAttributes = { storyType: type };

        const changedStory = Story.editStory(story, newAttributes);

        expect(changedStory).toEqual({
          _editing: {
            labels: [],
            storyType: type,
            estimate: '',
            _isDirty: true
          }
        });
      });
    })

    it('change story estimate and sets _isDirty to true', () => {
      const story = { _editing: { estimate: 1, storyType: 'feature' } };
      const newAttributes = { estimate: 2 };

      const changedStory = Story.editStory(story, newAttributes);

      expect(changedStory).toEqual({
        _editing: {
          labels: [],
          storyType: 'feature',
          estimate: newAttributes.estimate,
          _isDirty: true
        }
      });
    });
  });

  describe('updateStory', () => {
    it('update story type', () => {
      const story = { storyType: 'bug' };
      const newAttributes = { storyType: 'feature' };

      const changedStory = Story.updateStory(story, newAttributes);

      expect(changedStory).toEqual({
        storyType: newAttributes.storyType
      });
    });

    it('update story estimate', () => {
      const story = { estimate: 1 };
      const newAttributes = { estimate: 2 };

      const changedStory = Story.updateStory(story, newAttributes);

      expect(changedStory).toEqual({
        estimate: newAttributes.estimate
      });
    });
  });

  describe('setLoadingStory', () => {
    it('sets the loading state to true when false', () => {
      const story = { _editing: { loading: false } }

      const changedStory = Story.setLoadingStory(story);

      expect(changedStory._editing.loading).toEqual(true);
    });
  });

  describe('setLoadingValue', () => {
    it('sets the loading state to true', () => {
      const story = { loading: false };

      const changedStory = Story.setLoadingValue(story, true);

      expect(changedStory.loading).toEqual(true);
    });

    it('sets the loading state to false', () => {
      const story = { loading: true };

      const changedStory = Story.setLoadingValue(story, false);

      expect(changedStory.loading).toEqual(false);
    });
  });

  describe('storyFailure', () => {
    it('sets loading to false', () => {
      const story = { _editing: { loading: true }, errors: [] }

      const changedStory = Story.storyFailure(story);

      expect(changedStory._editing.loading).toEqual(false);
    });

    it('put error to errors array', () => {
      const error = "error";
      const story = { _editing: { loading: true }, errors: [] }

      const changedStory = Story.storyFailure(story, error);

      expect(changedStory.errors).toEqual([error]);
    });
  });

  describe('isNew', () => {
    it('returns true when story id is null', () => {
      const story = { id: null }

      expect(Story.isNew(story)).toBe(true);
    });

    it("returns false when story id isn't null", () => {
      const story = { id: 42 }

      expect(Story.isNew(story)).toBe(false);
    });
  });

  describe('canDelete', () => {
    it("returns true when story isn't accepted and isn't new", () => {
      const story = { id: 42, state: 'started' };

      expect(Story.canDelete(story)).toBe(true);
    });

    it('returns false when story is accepted', () => {
      const story = { id: 42, state: 'accepted' };

      expect(Story.canDelete(story)).toBe(false);
    });

    it('returns false when story is new', () => {
      const story = { id: null, state: 'started' };

      expect(Story.canDelete(story)).toBe(false);
    });
  });

  describe('canSave', () => {
    describe("when when story isn't accepted and the text isn't empty", () => {
      it("returns true ", () => {
        const story = { state: 'started', _editing: { title: 'title' } };

        expect(Story.canSave(story)).toBe(true);
      });
    });

    describe('when story is accepted', () => {
      it('returns false', () => {
        const story = { state: 'accepted', _editing: { title: 'title' } };

        expect(Story.canSave(story)).toBe(false);
      });
    });

    describe('when story title is null', () => {
      it('returns false when story title is null', () => {
        const story = { state: 'started', _editing: { title: "" } };

        expect(Story.canSave(story)).toBe(false);
      });
    });
  });

  describe('withoutNewStory', () => {
    it('remove a story with null id from a stories array', () => {
      const stories = [{ id: 1 }, { id: 2 }];
      const newStory = { id: null };

      const storiesWithEmptyStories = [
        stories[0],
        newStory,
        stories[1]
      ];

      expect(Story.withoutNewStory([...stories, newStory])).toEqual(stories);
      expect(Story.withoutNewStory([newStory, ...stories])).toEqual(stories);
      expect(Story.withoutNewStory(storiesWithEmptyStories)).toEqual(stories);
    });
  });

  describe('createNewStory', () => {
    const stories = [{ id: 1 }, { id: 3 }]

    it('returns an empty story', () => {
      const story = Story.createNewStory(stories, {});

      expect(story.id).toBe(null);
    });

    it('returns an expanded story', () => {
      const story = Story.createNewStory(stories, {});

      expect(story.collapsed).toBe(false);
    });

    describe('when there is already a new story in the store', () => {
      it('reuses the attributes of it', () => {
        const story = Story.createNewStory(stories, {});
        const attributes = { title: 'new Title' };
        const modifiedStory = Story.createNewStory(stories, attributes);

        expect(story.title).not.toEqual(modifiedStory.title);
        expect(modifiedStory.title).toEqual(attributes.title);
      });
    });
  });

  describe('replaceOrAddNewStory', () => {
    it('replace an empty for a new story', () => {
      const stories = [{ id: 1 }, { id: null }, { id: 3 }]
      const newStory = { id: 2 };
      const expectedArray = [stories[0], newStory, stories[2]];

      const newStoryArray = Story.replaceOrAddNewStory(stories, newStory);

      expect(newStoryArray).toEqual(expectedArray);
    });

    it('return an array with new story', () => {
      const stories = []
      const newStory = { id: 2 };
      const expectedArray = [newStory];

      const newStoryArray = Story.replaceOrAddNewStory(stories, newStory);

      expect(newStoryArray).toEqual(expectedArray);
    });

    it('add new story', () => {
      const stories = [{ id: 1 }, { id: 3 }]
      const newStory = { id: 2 };
      const expectedArray = [newStory, ...stories];

      const newStoryArray = Story.replaceOrAddNewStory(stories, newStory);

      expect(newStoryArray).toEqual(expectedArray);
    });
  });

  describe('getNextState', () => {
    describe('when the state is unscheduled', () => {
      const state = 'unscheduled';

      it('returns started when transition is start', () => {
        const transition = 'start';
        const expectedState = 'started'

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });

      it('returns the same state when transition is invalid', () => {
        const transition = 'invalidTransition';
        const expectedState = 'unscheduled'

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });
    });

    describe('when the state is unstarted', () => {
      const state = 'unstarted';

      it('returns started when transition is start', () => {
        const transition = 'start';
        const expectedState = 'started'

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });

      it('returns the same state when transition is invalid', () => {
        const transition = 'invalidTransition';
        const expectedState = 'unstarted'

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });
    });

    describe('when the state is started', () => {
      const state = 'started';

      it('returns finished when transition is finish', () => {
        const transition = 'finish';
        const expectedState = 'finished'

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });

      it('returns the same state when transition is invalid', () => {
        const transition = 'invalidTransition';
        const expectedState = 'started'

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });
    });

    describe('when the state is finished', () => {
      const state = 'finished';

      it('returns delivered when transition is deliver', () => {
        const transition = 'deliver';
        const expectedState = 'delivered'

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });

      it('returns the same state when transition is invalid', () => {
        const transition = 'invalidTransition';
        const expectedState = 'finished'

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });
    });

    describe('when the state is delivered', () => {
      const state = 'delivered';

      it('returns accepted when transition is accept', () => {
        const transition = 'accept';
        const expectedState = 'accepted'

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });

      it('returns rejected when transition is reject', () => {
        const transition = 'reject';
        const expectedState = 'rejected'

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });

      it('returns the same state when transition is invalid', () => {
        const transition = 'invalidTransition';

        expect(Story.getNextState(state, transition)).toBe(state);
      });
    });

    describe('when the state is rejected', () => {
      const state = 'rejected';

      it('returns started when transition is restart', () => {
        const transition = 'restart';
        const expectedState = 'started'

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });

      it('returns the same state when transition is invalid', () => {
        const transition = 'invalidTransition';

        expect(Story.getNextState(state, transition)).toBe(state);
      });
    });

    describe("when the state is accepted", () => {
      const state = 'accepted';

      it('not change state', () => {
        const transition = 'any';

        expect(Story.getNextState(state, transition)).toBe(state);
      });
    });

    describe("when the transition is release", () => {
      const state = 'any';

      it('returns accepted', () => {
        const expectedState = 'accepted';
        const transition = 'release';

        expect(Story.getNextState(state, transition)).toBe(expectedState);
      });
    });
  });

  describe('releaseIsLate', () => {
    it('returns true when relase date is before today', () => {
      const story = {
        releaseDate: moment().subtract(3, 'days'),
        storyType: 'release'
      };

      expect(Story.releaseIsLate(story)).toBe(true);
    });

    it('returns false when relase date is after today', () => {
      const story = {
        releaseDate: moment().add(3, 'days'),
        storyType: 'release'
      };

      expect(Story.releaseIsLate(story)).toBe(false);
    });

    it('returns false when relase date is today', () => {
      const story = {
        releaseDate: moment(),
        storyType: 'release'
      };

      expect(Story.releaseIsLate(story)).toBe(false);
    });

    it("returns false when story type isn't a release", () => {
      const story = {
        releaseDate: moment().subtract(3, 'days'),
        storyType: 'feature'
      };

      expect(Story.releaseIsLate(story)).toBe(false);
    });
  });

  describe('cloneStory', () => {
    it('retuns a new story with null id', () => {
      const story = { id: 42 };

      expect(Story.cloneStory(story).id).toBe(null);
    });

    it('retuns a new story with uncheduled state', () => {
      const story = { state: 'accepted' };

      expect(Story.cloneStory(story).state).toBe(status.UNSCHEDULED);
    });

    it('retuns a new dirty story', () => {
      const story = { _isDirty: false };

      expect(Story.cloneStory(story)._isDirty).toBe(true);
    });

    it('retuns a new expanded story', () => {
      const story = { collapsed: true };

      expect(Story.cloneStory(story).collapsed).toBe(false);
    });

    it('retuns the same story title', () => {
      const story = { title: 'My new Title' };

      expect(Story.cloneStory(story).title).toBe(story.title);
    });

    it('retuns the same story description', () => {
      const story = { description: 'My description' };

      expect(Story.cloneStory(story).description).toBe(story.description);
    });

    it('retuns the same story estimate', () => {
      const story = { estimate: 1 };

      expect(Story.cloneStory(story).estimate).toBe(story.estimate);
    });

    it('retuns the same story type', () => {
      const story = { storyType: 'feature' };

      expect(Story.cloneStory(story).storyType).toBe(story.storyType);
    });

    it("doesn't clone story tasks", () => {
      const story = { tasks: [{ id: 1 }, { id: 2 }] };

      expect(Story.cloneStory(story).tasks).toEqual([]);
    });

    it("doesn't clone story notes", () => {
      const story = { notes: [{ id: 1 }, { id: 2 }] };

      expect(Story.cloneStory(story).notes).toEqual([]);
    });

    it("doesn't clone story documents", () => {
      const story = { documents: [{ id: 1 }, { id: 2 }] };

      expect(Story.cloneStory(story).documents).toEqual([]);
    });
  });
});
