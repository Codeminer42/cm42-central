import reducer from 'reducers/stories';
import { toggleStory } from 'actions/story';

const storiesArray = [
  {
    id: 1,
    collapsed: true
  },
  {
    id: 2,
    collapsed: true
  },
  {
    id: 3,
    collapsed: true
  }
];

describe('Stories reducer', () => {
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
});
