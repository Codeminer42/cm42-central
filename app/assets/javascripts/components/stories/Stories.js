import React from 'react';
import StoryItem from '../story/StoryItem';

const Stories = ({column, stories }) => {
  if (!stories.length) {
    return null;
  }

  return (
    <>
      {stories.map((story, index) => (
        <StoryItem
          key={story.id}
          index={index}
          stories={stories}
          story={story}
          column={column}
        />
      ))}
    </>
  );
};

export default Stories;
