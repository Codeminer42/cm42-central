import { createTemporaryId } from "../../../app/assets/javascripts/models/beta/story";
import storiesReducer, {
  denormalizeAllScopes,
  storiesWithScope,
} from "../../../app/assets/javascripts/reducers/stories";
import actionTypes from "../../../app/assets/javascripts/actions/actionTypes";

describe("Stories Reducer", () => {
  describe("RECEIVE_STORIES", () => {
    const newId = createTemporaryId();
    const currentStories = {
      all: {
        stories: {
          byId: {
            1: {
              id: 1,
              title: "Story 1",
              collapsed: false,
              _editing: { id: 1 },
            },
            2: { id: 2, title: "Story 2", collapsed: true },
            [newId]: {
              id: newId,
              title: "New Story",
              collapsed: false,
              _editing: { id: newId },
            },
          },
          allIds: [1, 2, newId],
        },
      },
    };

    const fetchedStories = [
      { id: 1, title: "Story 1", collapsed: true },
      { id: 2, title: "Story 2", collapsed: true },
      { id: 3, title: "Story 3", collapsed: true },
      { id: 4, title: "Story 4", collapsed: true },
    ];

    it("merge fetched stories with current stories", () => {
      const state = currentStories;
      const action = {
        type: actionTypes.RECEIVE_STORIES,
        data: fetchedStories,
      };

      const newState = storiesReducer(state, action);

      expect(newState.all.stories.byId).toEqual(
        expect.objectContaining({
          1: expect.objectContaining({ id: 1, title: "Story 1" }),
          2: expect.objectContaining({ id: 2, title: "Story 2" }),
          3: expect.objectContaining({ id: 3, title: "Story 3" }),
          4: expect.objectContaining({ id: 4, title: "Story 4" }),
          [newId]: expect.objectContaining({ id: newId, title: "New Story" }),
        })
      );

      expect(newState.all.stories.allIds).toEqual(
        expect.arrayContaining([1, 2, 3, 4, newId])
      );
    });

    it("handle stories with collapsed property equal false based on the current state", () => {
      const state = currentStories;
      const action = {
        type: actionTypes.RECEIVE_STORIES,
        data: fetchedStories,
      };
      const newState = storiesReducer(state, action);

      expect(newState.all.stories.byId).toEqual(
        expect.objectContaining({
          1: expect.objectContaining({
            id: 1,
            collapsed: false,
            _editing: expect.objectContaining({ id: 1 }),
          }),
          [newId]: expect.objectContaining({
            id: newId,
            collapsed: false,
            _editing: expect.objectContaining({ id: newId }),
          }),
        })
      );

      expect(newState.all.stories.allIds).toEqual(
        expect.arrayContaining([1, newId])
      );
    });

    it("delete a serverBased if not fetched", () => {
      const fetchedStories = [{ id: 1, title: "Story 1", collapsed: true }];
      const currentStories = {
        all: {
          stories: {
            byId: {
              1: {
                id: 1,
                title: "Story 1",
                collapsed: false,
                serverBased: true,
              },
              2: {
                id: 2,
                title: "Story 2",
                collapsed: true,
                serverBased: true,
              },
              3: {
                id: 3,
                title: "Story 3",
                collapsed: true,
                serverBased: true,
              },
              [newId]: {
                id: newId,
                title: "New Story",
                collapsed: false,
                _editing: { id: newId },
              },
            },
            allIds: [1, 2, newId],
          },
        },
      };

      const state = currentStories;
      const action = {
        type: actionTypes.RECEIVE_STORIES,
        data: fetchedStories,
      };
      const newState = storiesReducer(state, action);

      expect(newState.all.stories.byId).toEqual({
        1: expect.objectContaining({
          id: 1,
          title: "Story 1",
          serverBased: true,
        }),
        [newId]: expect.objectContaining({ id: newId, title: "New Story" }),
      });

      expect(newState.all.stories.allIds).toEqual(
        expect.arrayContaining([1, newId])
      );
    });
  });

  describe("denormalizeStories", () => {
    it("denormalize a set of stories, including a Symbol as a key", () => {
      const symbolKey = createTemporaryId();
      const normalizedStories = {
        all: {
          stories: {
            byId: {
              1: { id: 1 },
              2: { id: 2 },
              [symbolKey]: { id: symbolKey },
            },
            allIds: [1, 2, symbolKey],
          },
        },
      };
      const denormalizedStories = storiesWithScope(normalizedStories);

      expect(denormalizedStories).toEqual([
        { id: 1 },
        { id: 2 },
        { id: symbolKey },
      ]);
    });
    it("handle an empty object", () => {
      const normalizedStories = {
        all: {
          stories: {
            byId: {},
            allIds: [],
          },
        },
      };
      const denormalizedStories = storiesWithScope(normalizedStories);

      expect(denormalizedStories).toEqual([]);
    });
  });
  describe("denormalizeAllScopes", () => {
    it("denormalize all scopes (all, epic, search)", () => {
      const symbolKey = Symbol("new");
      const normalizedState = {
        epic: {
          stories: {
            byId: {
              2: { id: 2 },
            },
            allIds: [2],
          },
        },
        all: {
          stories: {
            byId: {
              1: { id: 1 },
            },
            allIds: [1],
          },
        },
        search: {
          stories: {
            byId: {
              [symbolKey]: { id: symbolKey },
            },
            allIds: [symbolKey],
          },
        },
      };
      const denormalizedState = denormalizeAllScopes(normalizedState);
      const expectedDenormalizedState = {
        epic: [{ id: 2 }],
        all: [{ id: 1 }],
        search: [{ id: symbolKey }],
      };

      expect(denormalizedState).toEqual(expectedDenormalizedState);
    });
  });
});
