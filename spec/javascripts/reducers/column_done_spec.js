import reducer from 'reducers/columns/done';
import actionTypes from 'actions/actionTypes';

describe('Done Column reducer', () => {
  function createInitialStateWithStories() {
    return {
      stories: [
        {
          id: 4,
          acceptedAt: '2018-08-05T19:40:43.319Z'
        },
        {
          id: 7,
          acceptedAt: '2018-08-06T19:40:43.319Z'
        },
        {
          id: 1,
          acceptedAt: '2018-08-06T19:10:43.319Z'
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
      type: actionTypes.COLUMN_DONE,
      data
    }
  }

  describe("when the initial state is empty", () => {
    it("return the new story", () => {
      const newStory = {
        id : 80,
        acceptedAt: '2018-08-04T19:10:43.319Z'
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
        acceptedAt: '2018-08-04T19:10:43.319Z'
      };

      const initialState = createInitialStateWithStories();
      const action = createAction(newStory);

      const state = reducer(initialState, action);

      expect(state.stories.length).toEqual(4);
    });

    describe("when the new history has the lower date", () => {
      it("return stories ordered by date in ascending order", () => {
        const newStory = {
          id : 80,
          acceptedAt: '2018-08-04T19:10:43.319Z'
        };


        const initialState = createInitialStateWithStories();
        const action = createAction(newStory);

        const state = reducer(initialState, action);

        expect(state.stories[0].id).toEqual(newStory.id);
        expect(state.stories[1].id).toEqual(initialState.stories[0].id);
        expect(state.stories[2].id).toEqual(initialState.stories[2].id);
        expect(state.stories[3].id).toEqual(initialState.stories[1].id);
      });
    });

    describe("when the new history has the higher date", () => {
       it("return stories ordered by date in ascending order", () => {
        const newStory = {
          id : 80,
          acceptedAt: '2018-08-10T19:10:43.319Z'
        };


        const initialState = createInitialStateWithStories();
        const action = createAction(newStory);

        const state = reducer(initialState, action);

        expect(state.stories[0].id).toEqual(initialState.stories[0].id);
        expect(state.stories[1].id).toEqual(initialState.stories[2].id);
        expect(state.stories[2].id).toEqual(initialState.stories[1].id);
        expect(state.stories[3].id).toEqual(newStory.id);
      });
    });

    describe("when the new history has the date in the middle", () => {
      it("return stories ordered by date in ascending order", () => {
        const newStory =  {
          id: 80,
          acceptedAt: '2018-08-05T22:40:43.319Z'
        };

        const initialState = createInitialStateWithStories();
        const action = createAction(newStory);

        const state = reducer(initialState, action);

        expect(state.stories[0].id).toEqual(initialState.stories[0].id);
        expect(state.stories[1].id).toEqual(newStory.id);
        expect(state.stories[2].id).toEqual(initialState.stories[2].id);
        expect(state.stories[3].id).toEqual(initialState.stories[1].id);
      });
    });
  });
});
