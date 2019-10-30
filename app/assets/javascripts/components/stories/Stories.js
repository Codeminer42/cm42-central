import React, { Fragment } from "react";
import StoryItem from "../story/StoryItem";
import PropTypes from 'prop-types';
import StoryPropTypes from '../shapes/story';

const Stories = ({ stories, from }) => {
  if (!stories.length) {
    return null;
  }

  return (
    <Fragment>
      {stories.map((story, index) => (
        <StoryItem key={story.id} story={story} from={from} index={index} />
      ))}
    </Fragment>
  );
};

Stories.propTypes = {
  stories: PropTypes.arrayOf(StoryPropTypes),
  from: PropTypes.string
}

export default Stories;
