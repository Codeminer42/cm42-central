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
    let state;

    beforeEach(() => {
      state = reducer(initialState, action);
    });
    
    it("return an array with 2 sprints", () => {
      expect(state.sprints.length).toEqual(2);
    });

    it("return sprints with correct number key", () => {
      expect(state.sprints[0].number).toEqual(1);
      expect(state.sprints[1].number).toEqual(2);
    });

    it("return sprints with formatted startDate and endDate", () => {
      expect(state.sprints[0].startDate).toEqual("Thu Sep 13th 2018");
      expect(state.sprints[0].endDate).toEqual("Wed Sep 19th 2018");
      
      expect(state.sprints[1].startDate).toEqual("Thu Sep 20th 2018");
      expect(state.sprints[1].endDate).toEqual("Wed Sep 26th 2018");
    });

    it("return sprints with stories empty", () => {
      expect(state.sprints[0].stories).toEqual([]);
      expect(state.sprints[1].stories).toEqual([]);
    });
  });
});
