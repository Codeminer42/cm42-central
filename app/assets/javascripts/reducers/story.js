export const toggleStories = (stories, id) => {
  return stories.map((story) => {
    if (story.id !== id) {
      return story;
    }

    const previousState = !story.collapsed ? null : story;

    return {
      ...story,
      _previousState: previousState,
      collapsed: !story.collapsed
    };
  });
};      
