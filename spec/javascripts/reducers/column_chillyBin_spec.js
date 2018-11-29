import reducer from 'reducers/columns/chillyBin';
import actionTypes from 'actions/actionTypes';
import { toggleStory } from 'actions/story';

describe('Chilly Bin Column reducer', () => {

  const storiesArray = [
    {
      id: 4,
      position: '8',
      storyType: 'feature',
      estimate: 5,
      collapsed: true
    },
    {
      id: 7,
      position: '6.0',
      estimate: 3,
      collapsed: true
    }
  ];

  function createInitialStateWithStories() {
    return {
      stories: storiesArray
    }
  };

  function createEmptyInitialstate() {
    return {
      stories: []
    }
  };

  function createAction(data) {
    return {
      type: actionTypes.COLUMN_CHILLY_BIN,
      data
    }
  };

  describe("Toggle story", () => {
    describe("When story is collapsed", () => {
      it("expand story", () => {
        const initialState = createInitialStateWithStories();
        const story = initialState.stories[0];
        story.collapsed = true;

        const action = toggleStory(story.id);
        const state = reducer(initialState, action);

        const expandedStory = state.stories[0];

        expect(expandedStory.collapsed).toEqual(false);
      });

      describe("When story is expanded", () => {
        it("collapse story", () => {
          const initialState = createInitialStateWithStories();
          const story = initialState.stories[0];
          story.collapsed = false;

          const action = toggleStory(story.id);
          const state = reducer(initialState, action);

          const expandedStory = state.stories[0];

          expect(expandedStory.collapsed).toEqual(true);
        });
      });
    });
  });

  describe("when the initial state is empty", () => {
    it("return the new story with the others", () => {
      const newStory = {
        id: 80,
        position: '59.2'
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
        id: 80,
        position: '59.2'
      };

      const initialState = createInitialStateWithStories();
      const action = createAction(newStory);

      const state = reducer(initialState, action);

      expect(state.stories.length).toEqual(3);
    });

    it("return no error if the position is NaN", () => {
      const newStory = {
        id: 80,
        position: 'abc'
      };

      const initialState = createInitialStateWithStories();
      const action = createAction(newStory);

      const state = reducer(initialState, action);

      expect(state.stories.length).toEqual(3);
    });

    describe("when the new history has the lower position", () => {

      it("return stories ordered by position in ascending order", () => {
        const newStory = {
          id: 5,
          position: '5.2'
        };

        const initialState = createInitialStateWithStories();
        const action = createAction(newStory);

        const state = reducer(initialState, action);

        expect(state.stories[0].id).toEqual(newStory.id);
        expect(state.stories[1].id).toEqual(initialState.stories[1].id);
        expect(state.stories[2].id).toEqual(initialState.stories[0].id);
      });

      it("return unestimated features last", () => {
        const newStory = {
          id: 5,
          position: '1.2',
          storyType: 'feature',
          estimate: null
        };

        const initialState = createInitialStateWithStories();
        const action = createAction(newStory);

        const state = reducer(initialState, action);

        expect(state.stories[2].id).toEqual(newStory.id);;
      });
    });

    describe("when the new history has the higher position", () => {

      it("return stories ordered by position in ascending order", () => {
        const newStory = {
          id: 5,
          position: '9.2'
        };

        const initialState = createInitialStateWithStories();
        const action = createAction(newStory);

        const state = reducer(initialState, action);

        expect(state.stories[0].id).toEqual(initialState.stories[1].id);
        expect(state.stories[1].id).toEqual(initialState.stories[0].id);
        expect(state.stories[2].id).toEqual(newStory.id);
      });

      it("return unestimated features last", () => {
        const newStory = {
          id: 5,
          position: '9.2',
          storyType: 'feature',
          estimate: null
        };

        const initialState = createInitialStateWithStories();
        const action = createAction(newStory);

        const state = reducer(initialState, action);

        expect(state.stories[2].id).toEqual(newStory.id);;
      });
    });

    describe("when the new history has the position in the middle", () => {

      it("return stories ordered by position in ascending order", () => {
        const newStory = {
          id: 5,
          position: '7.2'
        };

        const initialState = createInitialStateWithStories();
        const action = createAction(newStory);

        const state = reducer(initialState, action);

        expect(state.stories[0].id).toEqual(initialState.stories[1].id);
        expect(state.stories[1].id).toEqual(newStory.id);
        expect(state.stories[2].id).toEqual(initialState.stories[0].id);
      });

      it("return unestimated features last", () => {
        const newStory = {
          id: 5,
          position: '7.2',
          storyType: 'feature',
          estimate: null
        };

        const initialState = createInitialStateWithStories();
        const action = createAction(newStory);

        const state = reducer(initialState, action);

        expect(state.stories[2].id).toEqual(newStory.id);;
      });
    });
  });

});
