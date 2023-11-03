import actionTypes from "actions/actionTypes";
import reducer, {
  denormalizedIterations,
} from "../../../app/assets/javascripts/reducers/pastIterations";

describe("Past Iterations Reducer", () => {
  describe("RECEIVE_PAST_ITERATIONS", () => {
    describe("when past interactions is not fetched", () => {
      it("returns a normalized and formatted past iterations", () => {
        const state = {};

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

        expect(reducer(state, action)).toEqual({
          pastIterations: {
            byId: {
              1: {
                hasStories: true,
                iterationNumber: 1,
                error: null,
                storyIds: [],
                fetched: false,
                isFetching: false,
                stories: undefined,
              },
            },
            allIds: [1],
          },
        });
      });
    });

    describe("when past interactions is fetched", () => {
      it("returns the normalized fetched state", () => {
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

        expect(reducer(state, action)).toEqual({
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
        });
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

  describe("denormalizePastIterations", () => {
    it("denormalize an object of pastIterations into an array", () => {
      const normalizedPastIterations = {
        pastIterations: {
          byId: {
            1: { iterationNumber: 1, data: "Iteration 1" },
            2: { iterationNumber: 2, data: "Iteration 2" },
          },
          allIds: [1, 2],
        },
      };
      const denormalizedPastIterations = denormalizedIterations(
        normalizedPastIterations
      );

      expect(denormalizedPastIterations).toEqual([
        { iterationNumber: 1, data: "Iteration 1" },
        { iterationNumber: 2, data: "Iteration 2" },
      ]);
    });

    it("handle an empty object", () => {
      const normalizedPastIterations = {
        pastIterations: { byId: {}, allIds: [] },
      };
      const denormalizedPastIterations = denormalizedIterations(
        normalizedPastIterations
      );

      expect(denormalizedPastIterations).toEqual([]);
    });

    it("handle undefined input", () => {
      const denormalizedPastIterations = denormalizedIterations(undefined);

      expect(denormalizedPastIterations).toEqual([]);
    });
  });
});
