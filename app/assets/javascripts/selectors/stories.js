import { denormalizeAllScopes, storiesWithScope } from "../reducers/stories";

export const getStories = (state) => denormalizeAllScopes(state.stories);

export const getStoriesWithScope = (state, scope) => {
  const stories = getStories(state);
  return storiesWithScope(stories, scope);
};
