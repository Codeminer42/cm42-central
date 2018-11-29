export const toggleStories = (stories, id) => {
  return stories.map((story) => {
    if (story.id !== id) {
      return story;
    }
    return {
      ...story,
      collapsed: !story.collapsed
    };
  });
};      
