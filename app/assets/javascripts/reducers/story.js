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

export const editStory = (stories, id, newAttributes) => {
  return stories.map((story) => {
    if (story.id !== id) {
      return story;
    };

    return {
      ...story,
      ...newAttributes 
    };
  });
};      
