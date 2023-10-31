import actionTypes from "actions/actionTypes";
import reducer from "../../../app/assets/javascripts/reducers/pastIterations";

jest.mock("../../../app/assets/javascripts/models/beta/pastIteration", () => ({
  normalizePastIterations: jest.fn((data) => data),
  denormalizePastIterations: jest.fn((data) => data),
}));

describe("Past Iterations Reducer", () => {
  describe("RECEIVE_PAST_ITERATIONS", () => {
    describe("when past interactions is not fetched", () => {
      it("returns formatted past iterations", () => {
        const state = [];

        const action = {
          type: actionTypes.RECEIVE_PAST_ITERATIONS,
          data: [
            {
              hasStories: true,
              iterationNumber: 1,
              stories: [],
            },
          ],
        };

        expect(reducer(state, action)).toEqual([
          {
            hasStories: true,
            iterationNumber: 1,
            error: null,
            storyIds: [],
            fetched: false,
            isFetching: false,
            stories: undefined,
          },
        ]);
      });
    });

    describe("when past interactions is fetched", () => {
      it("returns the fetched state", () => {
        const state = {
          pastIterations: {
            byId: {
              1: {
                hasStories: true,
                iterationNumber: 1,
                error: null,
                storyIds: [1, 2, 3],
                fetched: true,
                isFetching: false,
                stories: undefined,
              },
            },
            allIds: [1],
          },
        };

        const action = {
          type: actionTypes.RECEIVE_PAST_ITERATIONS,
          data: [
            {
              hasStories: true,
              iterationNumber: 1,
              stories: [],
            },
          ],
        };

        expect(reducer(state, action)).toEqual([
          {
            hasStories: true,
            iterationNumber: 1,
            error: null,
            storyIds: [1, 2, 3],
            fetched: true,
            isFetching: false,
            stories: undefined,
          },
        ]);
      });
    });
  });

  describe("REQUEST_PAST_STORIES", () => {
    it("adds isFetching: true, to the selected iteration ", () => {
      const state = {
        pastIterations: {
          byId: {
            1: {
              iterationNumber: 1,
            },
            2: {
              iterationNumber: 2,
            },
          },
          allIds: [1, 2],
        },
      };

      const action = {
        type: actionTypes.REQUEST_PAST_STORIES,
        iterationNumber: 1,
      };

      expect(reducer(state, action)).toEqual({
        pastIterations: {
          byId: {
            1: {
              iterationNumber: 1,
              isFetching: true,
            },
            2: {
              iterationNumber: 2,
            },
          },
          allIds: [1, 2],
        },
      });
    });
  });

  describe("RECEIVE_PAST_STORIES", () => {
    it("returns formatted past stories", () => {
      const state = {
        pastIterations: {
          byId: {
            1: {
              iterationNumber: 1,
            },
            2: {
              iterationNumber: 2,
            },
          },
          allIds: [1, 2],
        },
      };

      const action = {
        type: actionTypes.RECEIVE_PAST_STORIES,
        iterationNumber: 1,
        stories: [{ id: 1 }, { id: 2 }],
        from: undefined,
      };

      expect(reducer(state, action)).toEqual({
        pastIterations: {
          byId: {
            1: {
              iterationNumber: 1,
              fetched: true,
              isFetching: false,
              storyIds: [1, 2],
            },
            2: {
              iterationNumber: 2,
            },
          },
          allIds: [1, 2],
        },
      });
    });
  });

  describe("ERROR_REQUEST_PAST_STORIES", () => {
    it("returns state with error", () => {
      const state = {
        pastIterations: {
          byId: {
            1: {
              iterationNumber: 1,
            },
            2: {
              iterationNumber: 2,
            },
          },
          allIds: [1, 2],
        },
      };

      const action = {
        type: actionTypes.ERROR_REQUEST_PAST_STORIES,
        iterationNumber: 1,
        error: new Error("whoopsie"),
      };

      expect(reducer(state, action)).toEqual({
        pastIterations: {
          byId: {
            1: {
              iterationNumber: 1,
              fetched: false,
              isFetching: false,
              error: new Error("whoopsie"),
            },
            2: {
              iterationNumber: 2,
            },
          },
          allIds: [1, 2],
        },
      });
    });
  });

  describe("DEFAULT", () => {
    it("returns initialState", () => {
      expect(reducer(undefined, {})).toEqual({});
    });
  });
});
