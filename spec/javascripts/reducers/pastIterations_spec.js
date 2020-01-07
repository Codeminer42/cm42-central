import actionTypes from 'actions/actionTypes';
import reducer from "../../../app/assets/javascripts/reducers/pastIterations";

describe("Past Iterations Reducer", () => {
  describe("RECEIVE_PAST_ITERATIONS", () => {
    it("returns formatted past iterations,", () => {
      const state = [];

      const action = {
        type: actionTypes.RECEIVE_PAST_ITERATIONS,
        data: [{
          hasStories: true,
          iterationNumber: 1,
          stories: []
        }]
      };

      expect(reducer(state, action)).toEqual([{
        hasStories: true,
        iterationNumber: 1,
        error: null,
        storyIds: [],
        fetched: false,
        isFetching: false,
        stories: undefined
      }]);
    });
  });

  describe("REQUEST_PAST_STORIES", () => {
    it("add isFetching: true, to the selected iteration ", () => {
      const state = [
        {
          iterationNumber: 1
        },
        {
          iterationNumber: 2
        }
      ];

      const action = {
        type: actionTypes.REQUEST_PAST_STORIES,
        iterationNumber: 1,
      };

      expect(reducer(state, action)).toEqual([
        {
          iterationNumber: 1,
          isFetching: true
        },
        {
          iterationNumber: 2
        }
      ]);
    });
  });

  describe("RECEIVE_PAST_STORIES", () => {
    it("returns formatted past stories", () => {
      const state = [
        {
          iterationNumber: 1
        },
        {
          iterationNumber: 2
        }
      ];

      const action = {
        type: actionTypes.RECEIVE_PAST_STORIES,
        iterationNumber: 1,
        stories:[
          {id: 1},
          {id: 2}
        ],
        from: undefined
      };

      expect(reducer(state, action)).toEqual([
        {
          iterationNumber: 1,
          fetched: true,
          isFetching: false,
          storyIds: [ 1, 2 ]
        },
        { iterationNumber: 2}
      ]);
    });
  });


  describe("ERROR_REQUEST_PAST_STORIES", () => {
    it("returns state with error", () => {
      const state = [
        {
          iterationNumber: 1
        },
        {
          iterationNumber: 2
        }
      ];

      const action = {
        type: actionTypes.ERROR_REQUEST_PAST_STORIES,
        iterationNumber: 1,
        error: Error('whoopsie')
      };

      expect(reducer(state, action)).toEqual([
        {
          iterationNumber: 1,
          fetched: false,
          isFetching: false,
          error: Error('whoopsie')
        },
        {
          iterationNumber: 2
        }
      ]);
    });
  });

  describe("DEFAULT", () => {
    it("returns initialState", () => {
      expect(reducer(undefined, {})).toEqual([]);
    });
  });
});
