import React, { Fragment } from "react";
import StoryItem from "../story/StoryItem";
import PropTypes from 'prop-types';
import { storyPropTypesShape } from './../../models/beta/story';

const Stories = ({ stories, from }) => {
  if (!stories.length) {
    return null;
  }

  return (
    <Fragment>
      {stories.map(story => (
        <StoryItem key={story.id} story={story} from={from} />
      ))}
    </Fragment>
  );
};

Stories.propTypes = {
  stories: PropTypes.arrayOf(storyPropTypesShape),
  from: PropTypes.string
}

export default Stories;
