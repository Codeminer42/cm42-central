import moment from 'moment';
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
          state: 'accepted'
        },
        {
          id: 3,
          position: '3.2',
          state: 'unstarted'
        },
        {
          id: 4,
          position:'7.5',
          state: 'started'
        },
        {
          id: 5,
          position: '3.7',
          state: 'finished'
        },
        {
          id: 6,
          position: '4.9',
          state: 'delivered'
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
      it("return ordered by position", () => {
        const newStory = {
          id : 80,
          position: '59.2',
          state: 'finished'
        };

        const initialState = createInitialStateWithStories();
        const action = createAction(newStory);

        const state = reducer(initialState, action);

        expect(state.stories[0].state).toEqual('accepted');
        expect(state.stories[1].state).toEqual('delivered');
        expect(state.stories[2].state).toEqual('rejected');
        expect(state.stories[3].state).toEqual('finished');
        expect(state.stories[4].state).toEqual('finished');
        expect(state.stories[4].position).toEqual(newStory.position);
        expect(state.stories[5].state).toEqual('started');
        expect(state.stories[6].state).toEqual('unstarted');

      });
    });
  });

});
