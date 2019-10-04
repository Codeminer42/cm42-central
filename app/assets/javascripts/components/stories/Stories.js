import React from 'react';
import { connect } from 'react-redux';
import StoryItem from '../story/StoryItem';
import { dragDropStory } from '../../actions/story';

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

export default connect(
  null,
  { dragDropStory}
)(Stories)
