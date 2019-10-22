import React from 'react';
import StoryItem from '../story/StoryItem';
import PropTypes from 'prop-types';
import { storyPropTypesShape } from './../../models/beta/story';

const Stories = ({ column, stories, from }) => {
  if (!stories.length) {
    return null;
  }

  return stories.map((story, index) => (
    <StoryItem
      key={story.id}
      index={index}
      stories={stories}
      story={story}
      column={column}
      from={from}
    />
  ));
};

Stories.propTypes = {
  stories: PropTypes.arrayOf(storyPropTypesShape),
  from: PropTypes.string
}

export default Stories;
