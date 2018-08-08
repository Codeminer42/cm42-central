import reducer from 'reducers/columns/backlog';
import actionTypes from 'actions/actionTypes';

describe('Backlog Column reducer', () => {
  function createInitialStateWithStories() {
    return {
      stories: [
        {
          id: 2,
          position: '4.5',
          state: 'rejected'
        },
        {
          id: 1,
          position: '1.5',
          state: 'accepted',
          acceptedAt: '2018-08-06T16:36:20.811Z'
        },
        {
          id: 3,
          position: '3.2',
          state: 'unstarted'
        },
        {
          id: 4,
          position:'7.5',
          state: 'started',
          startedAt: '2018-08-06T16:36:20.811Z'
        },
        {
          id: 5,
          position: '3.7',
          state: 'finished'
        },
        {
          id: 6,
          position: '4.9',
          state: 'delivered',
          deliveredAt: '2018-08-06T16:36:20.811Z'
        }
      ]
    }
  }

  function createEmptyInitialstate() {
    return {
      stories: []
    }
  }

  function createAction(data) {
    return {
      type: actionTypes.COLUMN_BACKLOG,
      data
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
              state: 'unstarted'
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
              state: 'unstarted'
            };

            const initialState = createInitialStateWithStories();
            const action = createAction(newStory);

            const state = reducer(initialState, action);

            expect(state.stories[5].state).toEqual('unstarted');
            expect(state.stories[6].state).toEqual('unstarted');
            expect(state.stories[5].id).toEqual(newStory.id);
          });
        });
      });
    });
  });
});
