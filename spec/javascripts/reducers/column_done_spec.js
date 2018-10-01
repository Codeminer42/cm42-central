import reducer from 'reducers/columns/done';
import actionTypes from 'actions/actionTypes';

describe('Done Column reducer', () => {
  const createInitialStateWithStories = () => {
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
  };

  const createEmptyInitialstate = () => {
    return {
      stories: [],
      sprints: [],
    }
  };

  const createAction = (data) => {
    return {
      type: actionTypes.COLUMN_DONE,
      data
    }
  };

  const createReceiveAction = (data) => {
    return {
      type: actionTypes.RECEIVE_PROJECT,
      data
    }
  };

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

  describe("when we are receiving sprints from project", () => {
    it("return an array with 2 sprints", () => {
      const data = { 
        pastIterations: [
          {
            endDate: '2018/09/19',
            iterationNumber: 1,
            number: 1,
            points: 10,
            startDate: '2018/09/13',
            stories: []
          },
          {
            endDate: '2018/09/26',
            iterationNumber: 2,
            number: 2,
            points: 10,
            startDate: '2018/09/20',
            stories: [],
          },
        ]
      };
      
      const initialState = createEmptyInitialstate();
      const action = createReceiveAction(data);

      const state = reducer(initialState, action);

      expect(state.sprints.length).toEqual(2);
    });

    it("return an array with 2 sprints", () => {
      const data = { 
        pastIterations: [
          {
            endDate: '2018/09/19',
            iterationNumber: 1,
            number: 1,
            points: 10,
            startDate: '2018/09/13',
            stories: []
          },
          {
            endDate: '2018/09/26',
            iterationNumber: 2,
            number: 2,
            points: 10,
            startDate: '2018/09/20',
            stories: [],
          },
          {
            endDate: '2018/09/30',
            iterationNumber: 3,
            number: 3,
            points: 5,
            startDate: '2018/09/24',
            stories: [],
          },
        ]
      };
      
      const initialState = createEmptyInitialstate();
      const action = createReceiveAction(data);

      const state = reducer(initialState, action);

      expect(state.sprints.length).toEqual(3);
    });
  });
});
