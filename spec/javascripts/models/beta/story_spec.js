import * as Story from 'models/beta/story';
import moment from 'moment';
import { status, storyTypes, storyScopes } from 'libs/beta/constants';

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
    const { FEATURE, BUG, CHORE, RELEASE } = storyTypes;
    const { UNSTARTED, UNSCHEDULED, STARTED } = status;

    const notFeatureTypes = [BUG, CHORE, RELEASE];
    const estimatedValues = [1, 2, 3, 4];

    describe(`when story type is ${FEATURE}`, () => {
      notFeatureTypes.forEach(noFeatureType => {
        describe(`and new story type is ${noFeatureType}`, () => {
          const story = { _editing: { storyType: FEATURE, estimate: 1 } };
          const newAttributes = { storyType: noFeatureType }
          let changedStory;
          
          beforeEach(() => {
            changedStory = Story.editStory(story, newAttributes);
          })

          it('change story estimate to ""', () => {
            expect(changedStory._editing.estimate).toEqual('');
          })
        
          it(`change story type is ${noFeatureType}`, () => {
            expect(changedStory._editing.storyType).toEqual(noFeatureType);
          })
        });
      });

      describe(`when state is ${UNSTARTED}`, () => {
        describe(`and new state is ${UNSCHEDULED}`, () => {
          const story = { _editing: { storyType: FEATURE, state: UNSTARTED, estimate: 1 } };
          const newAttributes = { state: UNSCHEDULED }
          let changedStory;

          beforeEach(() => {
            changedStory = Story.editStory(story, newAttributes);
          });
          
          it("keep estimate 1", () => {    
            expect(changedStory._editing.estimate).toEqual(1);
          });

          it(`change state to ${UNSCHEDULED}`, () => {
            expect(changedStory._editing.state).toEqual(UNSCHEDULED);
          });
        });
      });

      estimatedValues.forEach(estimatedValue => {
        describe(`when estimate is ${estimatedValue}`, () => {
          describe(`and new estimate is ""`, () => {
            const story = { _editing: { storyType: FEATURE, estimate: estimatedValue, state: STARTED } };
            const newAttributes = { estimate: '' };
            let changedStory;

            beforeEach(() => {
              changedStory = Story.editStory(story, newAttributes);
            });

            it(`change state to unscheduled `, () => {    
              expect(changedStory._editing.state).toEqual(UNSCHEDULED);
            });

            it("change estimate to ''", () => {
              expect(changedStory._editing.estimate).toEqual('');
            });
          });
        });
      });

      describe(`when estimate is ""`, () => {
        estimatedValues.forEach(estimatedValue => {
          describe(`and new estimate is ${estimatedValue}`, () => {
            const story = { _editing: { storyType: FEATURE, estimate: '', state: UNSCHEDULED } };
            const newAttributes = { estimate: estimatedValue };
            let changedStory;
            
            beforeEach(() => {
              changedStory = Story.editStory(story, newAttributes);
            });

            it(`keep story state ${UNSCHEDULED}`, () => {
              expect(changedStory._editing.state).toEqual(UNSCHEDULED);
            });

            it(`change estimate to ${estimatedValue}`, () => {
              expect(changedStory._editing.estimate).toEqual(estimatedValue);
            });
          });
        });
      });
    });

    notFeatureTypes.forEach(noFeatureType => {
      describe(`when story type is ${noFeatureType}`, () => {
        const otherNotFeatureTypes = notFeatureTypes.filter(type => type !== noFeatureType);

        otherNotFeatureTypes.forEach(otherNotFeatureType => {          
          describe(`and new story type is ${otherNotFeatureType}`, () => {
            const story = { _editing: { storyType: noFeatureType, estimate: '' } };
            const newAttributes = { storyType: otherNotFeatureType }
            let changedStory;
          
            beforeEach(() => {
              changedStory = Story.editStory(story, newAttributes);
            });

            it("change estime to ''", () => {
              expect(changedStory._editing.estimate).toEqual('');
            });

            it(`change story type to ${otherNotFeatureType}`, () => {
              expect(changedStory._editing.storyType).toEqual(otherNotFeatureType);
            });
          });
        });

        Object.keys(status).forEach(item => {
          describe(`and new status is ${status[item]}`, () => {
            const story = { _editing: { storyType: noFeatureType } };
            const newAttributes = { state: status[item] }
            let changedStory;

            beforeEach(() => {
              changedStory = Story.editStory(story, newAttributes);
            });

            it(`change status to ${status[item]}`, () => {
              expect(changedStory._editing.state).toEqual(status[item]);
            });
          });
        });

        describe(`and story status is ${UNSCHEDULED}`, () => {
          describe(`and new story type is feature`, () => {
            const story = { _editing: { 
              storyType: noFeatureType, 
              estimate: '', 
              state: UNSCHEDULED } 
            };
            const newAttributes = { storyType: FEATURE }
            let changedStory;

            beforeEach(() => {
              changedStory = Story.editStory(story, newAttributes);
            });

            it('change estimate to ""', () => {    
              expect(changedStory._editing.estimate).toEqual('');
            });

            it(`change story type to ${FEATURE}`, () => {
              expect(changedStory._editing.storyType).toEqual(FEATURE);
            });

            it(`change state to ${UNSCHEDULED}`, () => {
              expect(changedStory._editing.state).toEqual(UNSCHEDULED);
            });
          });
        });

        describe(`when story status is ${UNSTARTED}`, () => {
          describe(`when new story type is feature`, () => {
            const story = { _editing: { 
                storyType: noFeatureType,
                estimate: 2,
                state: UNSTARTED
              } 
            };
            const newAttributes = { storyType: FEATURE }
            let changedStory;

            beforeEach(() => {
              changedStory = Story.editStory(story, newAttributes);
            });

            it('change story estimate to 1', () => {
              expect(changedStory._editing.estimate).toEqual(1);
            });

            it(`change story type to ${FEATURE}`, () => {
              expect(changedStory._editing.storyType).toEqual(FEATURE);
            });

            it(`change state to ${UNSTARTED}`, () => {
              expect(changedStory._editing.state).toEqual(UNSTARTED);
            });
          });
        });

        describe(`when state is ${UNSTARTED}`, () => {
          describe(`when new state is ${UNSCHEDULED}`, () => {
            const story = { _editing: { storyType: noFeatureType, state: UNSTARTED, estimate: '' } };
            const newAttributes = { state: UNSCHEDULED }
            let changedStory;

            beforeEach(() => {
              changedStory = Story.editStory(story, newAttributes);
            });

            it("change estimate to ''", () => {            
              expect(changedStory._editing.estimate).toEqual('');
            });

            it(`change state to ${UNSCHEDULED}`, () => {
              expect(changedStory._editing.state).toEqual(UNSCHEDULED);
            });
          });
        });

        describe(`when state is ${UNSCHEDULED}`, () => {
          describe(`when new state is ${UNSTARTED}`, () => {
            const story = { _editing: { storyType: noFeatureType, state: '', estimate: 1 } };
            const newAttributes = { state: UNSTARTED }
            let changedStory;

            beforeEach(() => {
              changedStory = Story.editStory(story, newAttributes);
            });

            it("change estimate to ''", () => {
              expect(changedStory._editing.estimate).toEqual('');
            });

            it(`change state to ${UNSTARTED}`, () => {
              expect(changedStory._editing.state).toEqual(UNSTARTED);
            });
          });
        });
      });
    });
  });

  describe('addNewAttributes', () => {
    it('update story type', () => {
      const story = { storyType: 'bug' };
      const newAttributes = { storyType: 'feature' };

      const changedStory = Story.addNewAttributes(story, newAttributes);

      expect(changedStory).toEqual({
        storyType: newAttributes.storyType
      });
    });

    it('update story estimate', () => {
      const story = { estimate: 1 };
      const newAttributes = { estimate: 2 };

      const changedStory = Story.addNewAttributes(story, newAttributes);

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

  describe('findById', () => {
    it('return the story by id', () => {
      const stories = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(Story.findById(stories, 1)).toEqual(stories[0]);
    });
  });

  describe('storyFailure', () => {
    it('sets loading to false', () => {
      const story = { _editing: { loading: true }, errors: [] }

      const changedStory = Story.storyFailure(story);

      expect(changedStory._editing.loading).toEqual(false);
    });

    it('put error to errors object', () => {
      const error = "error";
      const story = { _editing: { loading: true }, errors: {} }

      const changedStory = Story.storyFailure(story, error);

      expect(changedStory.errors).toEqual(error);
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

  describe('canEdit', () => {
    describe('when the story is accepted', () => {
      it('returns false', () => {
        const story = {state: 'accepted'};

        expect(Story.canEdit(story)).toBe(false);
      });
    });

    describe(`when story is unscheduled`, () => {
      it(`returns true`, () => {
        const story = {state: 'unscheduled'};

        expect(Story.canEdit(story)).toBe(true);
      });
    });

    describe(`when story is unstarted`, () => {
      it(`returns true`, () => {
        const story = {state: 'unstarted'};

        expect(Story.canEdit(story)).toBe(true);
      });
    });

    describe(`when story is started`, () => {
      it(`returns true`, () => {
        const story = {state: 'started'};

        expect(Story.canEdit(story)).toBe(true);
      });
    });

    describe(`when story is finished`, () => {
      it(`returns true`, () => {
        const story = {state: 'finished'};

        expect(Story.canEdit(story)).toBe(true);
      });
    });

    describe(`when story is delivered`, () => {
      it(`returns true`, () => {
        const story = {state: 'delivered'};

        expect(Story.canEdit(story)).toBe(true);
      });
    });

    describe(`when story is rejected`, () => {
      it(`returns true`, () => {
        const story = {state: 'rejected'};

        expect(Story.canEdit(story)).toBe(true);
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

  describe("possibleStatesFor", () => {
    const invalidEstimates = [null, ''];
    const validEstimates = [1,2,3]

    const featureTypes = Story.types.filter(type => type === storyTypes.FEATURE)
    const noFeatureTypes = Story.types.filter(type => type !== storyTypes.FEATURE)

    featureTypes.forEach(featureType => {
      describe(`when storyType is ${featureType}`, () => {
        invalidEstimates.forEach(invalidEstimate => {
          describe(`and estimate is "${invalidEstimate}"`, () => {
            let story;

            beforeEach(() => {
              story = { _editing:  { estimate: invalidEstimate, storyType: featureType } }
            });

            it(`state has to be ${status.UNSCHEDULED}`, () => {
              expect(Story.possibleStatesFor(story)[0]).toEqual(status.UNSCHEDULED);
            })

            it('returns just one state', () => {
              expect(Story.possibleStatesFor(story).length).toEqual(1);
            })
          })
        })

        validEstimates.forEach(validEstimate => {
          describe(`and estimate is ${validEstimate}`, () => {
            let story;

            beforeEach(() => {
              story = { _editing: { estimate: validEstimate, storyType: featureType } }
            });

            it('return all states', () => {
              expect(Story.possibleStatesFor(story).length).toEqual(7);
            })
          })
        })
      })
    })

    noFeatureTypes.forEach(noFeatureType => {
      describe(`when storyType is ${noFeatureType}`, () => {
        invalidEstimates.forEach(invalidEstimate => {
          describe(`and estimate is "${invalidEstimate}"`, () => {
            let story;

            beforeEach(() => {
              story = { _editing: { estimate: invalidEstimate, storyType: noFeatureType } }
            });

            it('returns all states', () => {
              expect(Story.possibleStatesFor(story).length).toEqual(7);
            })
          })

          validEstimates.forEach(validEstimate => {
            describe(`and estimate is ${validEstimate}`, () => {
              let story;

              beforeEach(() => {
                story = { _editing: { estimate: validEstimate, storyType: noFeatureType } }
              });

              it('returns all states', () => {
                expect(Story.possibleStatesFor(story).length).toEqual(7);
              })
            })
          })
        })
      })
    })
  });

  describe('withScope', () => {
    const stories = {
      [storyScopes.ALL]: [
        { id: 1, storyType: storyTypes.FEATURE },
        { id: 2, storyType: storyTypes.FEATURE },
        { id: 3, storyType: storyTypes.FEATURE }
      ],
      [storyScopes.SEARCH]: [
        { id: 4, storyType: storyTypes.FEATURE },
        { id: 5, storyType: storyTypes.FEATURE },
        { id: 6, storyType: storyTypes.FEATURE }
      ]
    }
    const invalidScopes = [null, undefined, false, 0];

    invalidScopes.forEach(scope => {
      describe(`when scope is ${scope}`, () => {
        it('returns stories of scope "all"', () => {
          expect(Story.withScope(stories, scope)).toEqual([
            { id: 1, storyType: storyTypes.FEATURE },
            { id: 2, storyType: storyTypes.FEATURE },
            { id: 3, storyType: storyTypes.FEATURE }
          ])
        });
      });
    });

    describe(`when scope is ${storyScopes.ALL}`, () => {
      it(`return stories of scope "${storyScopes.ALL}"`, () => {
        expect(Story.withScope(stories, storyScopes.ALL)).toEqual([
          { id: 1, storyType: storyTypes.FEATURE },
          { id: 2, storyType: storyTypes.FEATURE },
          { id: 3, storyType: storyTypes.FEATURE }
        ]);
      });
    });

    describe(`when scope is ${storyScopes.SEARCH}`, () => {
      it(`return stories of scope "${storyScopes.SEARCH}"`, () => {
        expect(Story.withScope(stories, storyScopes.SEARCH)).toEqual([
          { id: 4, storyType: storyTypes.FEATURE },
          { id: 5, storyType: storyTypes.FEATURE },
          { id: 6, storyType: storyTypes.FEATURE }
        ]);
      });
    });
  });

  describe('totalPoints', () => {
    const stories = [
      {
        estimate: 1,
        storyType: storyTypes.FEATURE
      },
      {
        estimate: 1,
        storyType: storyTypes.FEATURE
      },
      {
        estimate: 1,
        storyType: storyTypes.FEATURE
      }
    ];

    it('return 3', () => {
      expect(Story.totalPoints(stories)).toEqual(3);
    });
  });

  describe('isHighlighted', () => {
    describe('when highlighted is false', () => {
      it('returns falsy', () => {
        const story = { highlighted: false };
        
        expect(Story.isHighlighted(story)).toBeFalsy();
      });
    });

    describe('when highlighted is true', () => {
      it('returns truthy', () => {
        const story = { highlighted: true };

        expect(Story.isHighlighted(story)).toBeTruthy();
      });
    });

    describe('when have not highlighted', () => {
      it('returns falsy', () => {
        const story = {};

        expect(Story.isHighlighted(story)).toBeFalsy();
      });
    }); 
  });

  describe('isSearch', () => {
    const noSearchScopes = [storyScopes.ALL];

    noSearchScopes.forEach(scope => {
      describe(`when scope is ${scope}`, () => {
        it('returns falsy', () => {
          expect(Story.isSearch(scope)).toBeFalsy();
        });
      });

      describe(`when scope is ${storyScopes.SEARCH}`, () => {
        it('returns truthy', () => {
          expect(Story.isSearch(storyScopes.SEARCH)).toBeTruthy();
        });
      });
    });
  });

  describe('haveHighlightButton', () => {
    const stories = [
      { id: 1, storyType: storyTypes.FEATURE },
      { id: 2, storyType: storyTypes.FEATURE },
      { id: 3, storyType: storyTypes.FEATURE },
    ];

    const noSearchScopes = [storyScopes.ALL];

    stories.forEach(story => {
      describe(`when story id is ${story.id}`, () => {
        noSearchScopes.forEach(scope => {
          describe(`and scope is ${scope}`, () => {
            it('returns falsy', () => {
              expect(Story.haveHighlightButton(stories, story, scope)).toBeFalsy();
            });
          });
        });

        describe(`and scope ${storyScopes.SEARCH}`, () => {
          it('returns truthy', () => {
            expect(Story.haveHighlightButton(stories, story, storyScopes.SEARCH)).toBeTruthy();
          });
        });
      });
    });

    describe('when story id is 100', () => {
      const fakeStory = { id: 100, storyType: storyTypes.FEATURE };

      noSearchScopes.forEach(scope => {
        describe(`and scope is ${scope}`, () => {
          it('returns falsy', () => {
            expect(Story.haveHighlightButton(stories, fakeStory, scope)).toBeFalsy();
          });
        });
      });

      describe(`and scope ${storyScopes.SEARCH}`, () => {
        it('returns falsy', () => {
          expect(Story.haveHighlightButton(stories, fakeStory, storyScopes.SEARCH)).toBeFalsy();
        });
      });
    });
  });

  describe('haveSearch', () => {
    describe('when have zero search stories', () => {
      const stories = { 
        [storyScopes.SEARCH]: [] 
      };

      it('returns falsy', () => {
        expect(Story.haveSearch(stories)).toBeFalsy();
      });
    });

    describe('when have more than one search story', () => {
      const stories = {
        [storyScopes.SEARCH]: [
          { id: 1, storyType: storyTypes.FEATURE },
          { id: 2, storyType: storyTypes.FEATURE },
          { id: 3, storyType: storyTypes.FEATURE },
        ]
      }

      it('returns truthy', () => {
        expect(Story.haveSearch(stories)).toBeTruthy();
      });
    });
  });

  describe('haveStory', () => {
    const stories = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];

    stories.forEach(story => {
      describe(`when story is present in the stories array`, () => {
        it('returns truthy', () => {
          expect(Story.haveStory(story, stories)).toBeTruthy();
        });
      });
    });

    describe('when story is not present in stories array', () => {
      it('returns falsy', () => {
        const story = { id: 100 };

        expect(Story.haveStory(story, stories)).toBeFalsy();
      });
    });
  });

  describe('stateFor', () => {
    const { BUG, CHORE, RELEASE } = storyTypes;
    const { UNSTARTED, UNSCHEDULED } = status;

    describe('when is a feature', () => {
      describe('and have no estimate', () => {
        const story = { _editing: { id: 1, storyType: storyTypes.FEATURE, estimate: '' } };
        const newAttributes = { state: UNSTARTED }
        const newStory = { ...story, ...newAttributes };

        it(`return ${UNSCHEDULED}`, () => {
          expect(Story.stateFor(story, newAttributes, newStory)).toEqual(UNSCHEDULED);
        });
      });

      describe('and new attributes have no estimate', () => {
        const story = { _editing: { id: 1, storyType: storyTypes.FEATURE, estimate: 2 } };
        const newAttributes = { estimate: '' };
        const newStory = { ...story, ...newAttributes };

        it(`return ${UNSCHEDULED}`, () => {
          expect(Story.stateFor(story, newAttributes, newStory)).toEqual(UNSCHEDULED);
        });
      });

      describe(`and new attributes have state ${UNSCHEDULED}`, () => {
        const story = { _editing: { id: 1, storyType: storyTypes.FEATURE, estimate: 2 } };
        const newAttributes = { state: UNSCHEDULED };
        const newStory = { ...story, ...newAttributes };

        it(`return ${UNSCHEDULED}`, () => {
          expect(Story.stateFor(story, newAttributes, newStory)).toEqual(UNSCHEDULED);
        });
      });
    });

    const noFeatureTypes = [BUG, CHORE, RELEASE];

    noFeatureTypes.forEach(noFeatureType => {
      describe(`when is ${noFeatureType}`, () => {
        Story.states.forEach(state => {
          describe(`and new attributes is state ${state}`, () => {
            const story = { _editing: { id: 1, storyType: noFeatureType, estimate: 2 } };
            const newAttributes = { state };
            const newStory = { ...story, ...newAttributes };

            it(`return ${state}`, () => {
              expect(Story.stateFor(story, newAttributes, newStory)).toEqual(state);
            });
          });
        });
      });
    });
  });

  describe('estimateFor', () => {
    const { BUG, CHORE, RELEASE } = storyTypes;
    const noFeatureTypes = [BUG, CHORE, RELEASE];

    noFeatureTypes.forEach(noFeatureType => {
      describe(`when story type is ${noFeatureType}`, () => {
        describe('and new attributes have estimate 2', () => {
          const story = { _editing: { id: 1, storyType: noFeatureType, estimate: '' } };
          const newAttributes = { estimate: 2 };
          const newStory = { ...story, ...newAttributes };
  
          it('return an empty string', () => {
            expect(Story.estimateFor(story, newAttributes, newStory)).toEqual('');
          });
        });

        describe('and new attributes have story type feature', () => {
          const story = { _editing: { id: 1, storyType: noFeatureType, estimate: '' } };
          const newAttributes = { storyType: 'feature' };
          const newStory = { ...story, ...newAttributes };

          it('return 1', () => {
            expect(Story.estimateFor(story, newAttributes, newStory)).toEqual(1);
          });
        });
      });
    });
  });

  describe('needConfirmation', () => {
    const needConfirmationStates = [status.ACCEPTED, status.REJECTED, status.RELEASE];
    const noNeedConfirmationStates = [
      status.DELIVERED, status.STARTED, status.FINISHED,
      status.UNSTARTED, status.UNSCHEDULED
    ];

    needConfirmationStates.forEach(state => {
      describe(`when state is ${state}`, () => {
        it('returns truthy', () => {
          const story = { state };

          expect(Story.needConfirmation(story)).toBeTruthy();
        });
      });
    });

    noNeedConfirmationStates.forEach(state => {
      describe(`when state is ${state}`, () => {
        it('returns falsy', () => {
          const story = { state };

          expect(Story.needConfirmation(story)).toBeFalsy();
        });
      });
    });
  });
});
