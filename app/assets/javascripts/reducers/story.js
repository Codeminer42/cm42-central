import { isFeature } from 'models/beta/story'

export const toggleStories = (stories, id) => {
  return stories.map((story) => {
    if (story.id !== id) {
      return story;
    }

    const editing = !story.collapsed ? null : story;

    return {
      ...story,
      _editing: editing,
      collapsed: !story.collapsed
    };
  });
};

export const editStory = (stories, id, newAttributes) => {
  return stories.map((story) => {
    if (story.id !== id) {
      return story;
    };

    const newStory = { ...story._editing, ...newAttributes };
    newStory.estimate = !isFeature(newStory) ? null : newStory.estimate;

    return {
      ...story,
      _editing: newStory
    };
  });
};      
