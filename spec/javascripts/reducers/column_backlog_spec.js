import reducer from 'reducers/columns/backlog';
import actionTypes from 'actions/actionTypes';
import moment from 'moment';

describe('Backlog Column reducer', () => {
  let project;

  beforeEach(() => {
    project = {
      startDate: moment(new Date()).subtract(3, 'weeks').format(),
      iterationLength: 1,
      defaultVelocity: 2,
      iterationStartDay: 1,
    }
  });

  function createInitialStateWithStories() {
    return {
      stories: [
        {
          id: 2,
          position: '4.5',
          state: 'rejected',
          estimate: 1
        },
        {
          id: 1,
          position: '1.5',
          state: 'accepted',
          acceptedAt: '2018-08-06T16:36:20.811Z',
          estimate: 1
        },
        {
          id: 3,
          position: '3.2',
          state: 'unstarted',
          estimate: 1
        },
        {
          id: 4,
          position:'7.5',
          state: 'started',
          startedAt: '2018-08-06T16:36:20.811Z',
          estimate: 1
        },
        {
          id: 5,
          position: '3.7',
          state: 'finished',
          estimate: 1
        },
        {
          id: 6,
          position: '4.9',
          state: 'delivered',
          deliveredAt: '2018-08-06T16:36:20.811Z',
          estimate: 1
        }
      ],
    }
  }

  function createEmptyInitialstate() {
    return {
      stories: [],
      sprints: [],
    }
  }

  function createAction(data) {
    return {
      type: actionTypes.COLUMN_BACKLOG,
      data,
      project,
    }
  }

  describe("when the initial state is empty", () => {
    it("return the new story with the others", () => {
      const newStory = {
        id : 80,
        position: '59.2',
        state: 'delivered'
      };

      const initialState = createEmptyInitialstate();
      const action = createAction(newStory);

      const state = reducer(initialState, action);

      expect(state.stories.length).toEqual(1);
    });
  });


  describe("when there are stories on the initial state", () => {
    it("return the new story with the others", () => {
      const newStory = {
        id : 80,
        position: '59.2',
        state: 'delivered'
      };

      const initialState = createInitialStateWithStories();
      const action = createAction(newStory);

      const state = reducer(initialState, action);

      expect(state.stories.length).toEqual(7);
    });

    it("return stories ordered by state", () => {

      const initialState = createInitialStateWithStories();
      const action = createAction({});

      const state = reducer(initialState, action);

      expect(state.stories[0].state).toEqual('accepted');
      expect(state.stories[1].state).toEqual('delivered');
      expect(state.stories[2].state).toEqual('rejected');
      expect(state.stories[3].state).toEqual('finished');
      expect(state.stories[4].state).toEqual('started');
      expect(state.stories[5].state).toEqual('unstarted');
    });

    describe("when stories are grouped by sprints", () => {
      let state;
      let action;
      const stories = [
        {
          id: 1,
          position: '1.0',
          state: 'unstarted',
          estimate: 2,
          storyType: "feature",
        },
        {
          id: 2,
          position: '2.0',
          state: 'unstarted',
          estimate: 2,
          storyType: "feature",
        },
        {
          id: 3,
          position: '4.0',
          state: 'delivered',
          estimate: 2,
          storyType: "feature",
        },
        {
          id: 4,
          position: '4.0',
          state: 'finished',
          estimate: 2,
          storyType: "feature",
        },
      ];
      
      beforeEach(() => {
        action = createAction(stories);
        
        state = reducer({ stories: stories, sprints: [] }, action);
      });
      
      it("creates 3 sprints", () => {
        expect(state.sprints.length).toEqual(3);
      });

      it("adds 2 stories to current sprint", () => {
        expect(state.sprints[0].stories.length).toEqual(2);
      });

      it("stories grouped in current sprint are ordered by state", () => {
        expect(state.sprints[0].stories[0].state).toEqual('delivered');
        expect(state.sprints[0].stories[1].state).toEqual('finished');
      });

      describe("when project has started 3 weeks ago", () => {
        it("first sprint number should be 4", () => {
          expect(state.sprints[0].number).toEqual(4);
        })
      });

      describe("when project startDate is today", () => {
        it("sprint number should be 1", () => {
          project.startDate = new Date();

          action = createAction(stories);
          state = reducer({ stories: stories, sprints: [] }, action);
         
          expect(state.sprints[0].number).toEqual(1);
        });
      });
    });

    describe("when the story states are the same", () => {
      describe("accepted stories", () => {
        describe("when the acceptedAt of the new story is older then the others", () => {
          it("return accepted ordered by acceptedAt", () => {
            const newStory = {
              id : 80,
              position: '59.2',
              state: 'accepted',
              acceptedAt: '2018-08-03T16:36:20.811Z'
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[0].state).toEqual('accepted');
            expect(state.stories[1].state).toEqual('accepted');
            expect(state.stories[0].id).toEqual(newStory.id);
          });
        });

        describe("when the acceptedAt of the new story is more recent then the others", () => {
          it("return accepted ordered by acceptedAt", () => {
            const newStory = {
              id : 80,
              position: '59.2',
              state: 'accepted',
              acceptedAt: '2018-08-10T16:36:20.811Z'
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[0].state).toEqual('accepted');
            expect(state.stories[1].state).toEqual('accepted');
            expect(state.stories[1].id).toEqual(newStory.id);
          });
        });
      });

      describe("delivered stories", () => {
        describe("when the deliveredAt of the new story is older then the others", () => {
          it("return delivered ordered by deliveredAt", () => {
            const newStory = {
              id : 80,
              position: '59.2',
              state: 'delivered',
              deliveredAt: '2018-08-03T16:36:20.811Z'
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[1].state).toEqual('delivered');
            expect(state.stories[2].state).toEqual('delivered');
            expect(state.stories[1].id).toEqual(newStory.id);
          });
        });

        describe("when the deliveredAt of the new story is more recent then the others", () => {
          it("return delivered ordered by deliveredAt", () => {
            const newStory = {
              id : 80,
              position: '59.2',
              state: 'delivered',
              deliveredAt: '2018-08-20T16:36:20.811Z'
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);
            expect(state.stories[1].state).toEqual('delivered');
            expect(state.stories[2].state).toEqual('delivered');
            expect(state.stories[2].id).toEqual(newStory.id);
          });
        });
      });

      describe("started stories", () => {
        describe("when the startedAt of the new story is older then the others", () => {
          it("return accepted ordered by startedAt", () => {
            const newStory = {
              id : 80,
              position: '59.2',
              state: 'started',
              startedAt: '2018-08-03T16:36:20.811Z'
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[4].state).toEqual('started');
            expect(state.stories[5].state).toEqual('started');
            expect(state.stories[4].id).toEqual(newStory.id);
          });
        });

        describe("when the startedAt of the new story is more recent then the others", () => {
          it("return started ordered by startedAt", () => {
            const newStory = {
              id : 80,
              position: '59.2',
              state: 'started',
              startedAt: '2018-08-20T16:36:20.811Z'
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);
            expect(state.stories[4].state).toEqual('started');
            expect(state.stories[5].state).toEqual('started');
            expect(state.stories[5].id).toEqual(newStory.id);
          });
        });
      });

      describe("rejected, finished, unstarted stories ordered by position", () => {
        describe("when the new history has the higher position", () => {
          it("return rejected ordered by position", () => {
            const newStory = {
              id : 80,
              position: '59.2',
              state: 'rejected'
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[2].state).toEqual('rejected');
            expect(state.stories[3].state).toEqual('rejected');
            expect(state.stories[3].id).toEqual(newStory.id);
          });

          it("return finished ordered by position", () => {
            const newStory = {
              id : 80,
              position: '59.2',
              state: 'finished'
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[3].state).toEqual('finished');
            expect(state.stories[4].state).toEqual('finished');
            expect(state.stories[4].id).toEqual(newStory.id);
          });

          it("return unstarted ordered by position", () => {
            const newStory = {
              id : 80,
              position: '59.2',
              state: 'unstarted',
              estimate: 1
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[5].state).toEqual('unstarted');
            expect(state.stories[6].state).toEqual('unstarted');
            expect(state.stories[6].id).toEqual(newStory.id);
          });

          it("return unestimated unstarted features last", () => {
            const newStory = {
              id : 80,
              position: '59.2',
              state: 'unstarted',
              estimate: null
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[5].state).toEqual('unstarted');
            expect(state.stories[6].state).toEqual('unstarted');
            expect(state.stories[6].id).toEqual(newStory.id);
          });
        });

        describe("when the new history has the lower position", () => {
          it("return rejected ordered by position", () => {
            const newStory = {
              id : 80,
              position: '1.0',
              state: 'rejected'
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[2].state).toEqual('rejected');
            expect(state.stories[3].state).toEqual('rejected');
            expect(state.stories[2].id).toEqual(newStory.id);
          });

          it("return finished ordered by position", () => {
            const newStory = {
              id : 80,
              position: '1',
              state: 'finished'
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[3].state).toEqual('finished');
            expect(state.stories[4].state).toEqual('finished');
            expect(state.stories[3].id).toEqual(newStory.id);
          });

          it("return unstarted ordered by position", () => {
            const newStory = {
              id : 80,
              position: '1',
              state: 'unstarted',
              estimate: 1
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[5].state).toEqual('unstarted');
            expect(state.stories[6].state).toEqual('unstarted');
            expect(state.stories[5].id).toEqual(newStory.id);
          });

          it("return unestimated unstarted features last", () => {
            const newStory = {
              id : 80,
              position: '1',
              state: 'unstarted',
              storyType: 'feature',
              estimate: null
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[5].state).toEqual('unstarted');
            expect(state.stories[6].state).toEqual('unstarted');
            expect(state.stories[6].id).toEqual(newStory.id);
          });
        });
      });
    });
  });
});
