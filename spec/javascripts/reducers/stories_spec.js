import reducer from 'reducers/stories';
import { toggleStory, editStory } from 'actions/story';

describe('Stories reducer', () => {
  let storiesArray;

  beforeEach(() => {
    storiesArray = [
      {
        id: 1,
        collapsed: true,
        storyType: 'feature',
        estimate: 1
      },
      {
        id: 2,
        collapsed: true,
        storyType: 'feature',
        estimate: 1
      },
      {
        id: 3,
        collapsed: true,
        storyType: 'feature',
        estimate: 1
      }
    ];
  });

  describe("Toggle story", () => {
    describe("When story is collapsed", () => {
      it("expand story", () => {
        const initialState = storiesArray;
        const story = storiesArray[0];
        story.collapsed = true;

        const action = toggleStory(story.id);
        const storiesState = reducer(initialState, action);

        const expandedStory = storiesState[0];

        expect(expandedStory.collapsed).toEqual(false);
      });
    });

    describe("When story is expanded", () => {
      it("collapse story", () => {
        const initialState = storiesArray;
        const story = storiesArray[0];
        story.collapsed = false;

        const action = toggleStory(story.id);
        const storiesState = reducer(initialState, action);

        const collasedStory = storiesState[0];

        expect(collasedStory.collapsed).toEqual(true);
      });
    });
  });

  describe("Edit a story", () => {
    it("change story type", () => {
      const initialState = storiesArray;
      const story = storiesArray[0];
      story.storyType = 'feature';

      const action = editStory(story.id, {storyType: 'bug'});
      const storiesState = reducer(initialState, action);

      const changedStory = storiesState[0];

      expect(changedStory.storyType).toEqual('bug');
    });

    it("change story estimate", () => {
      const initialState = storiesArray;
      const story = storiesArray[0];
      story.estimate = 1;

      const action = editStory(story.id, {estimate: 2});
      const storiesState = reducer(initialState, action);

      const changedStory = storiesState[0];

      expect(changedStory.estimate).toEqual(2);
    });
  });
});
