import React, { Fragment } from 'react';
import StoryItem from '../story/StoryItem';

const Stories = ({column, stories }) => {
  if (!stories.length) {
    return null;
  }

  return (
    <Fragment>
      {stories.map((story, index) => (
        <StoryItem
          key={story.id}
          index={index}
          stories={stories}
          story={story}
          column={column}
        />
      ))}
    </Fragment>
  );
};

export default Stories;
