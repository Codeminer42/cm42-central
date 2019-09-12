import React, { Fragment } from "react";
import StoryItem from "../story/StoryItem";

const Stories = ({ stories, isChillyBin = false }) => {
  if (!stories.length) {
    return null;
  }

  return (
    <Fragment>
      {stories.map(story => (
        <StoryItem key={story.id} story={story} isChillyBin={isChillyBin} />
      ))}
    </Fragment>
  );
};

export default Stories;
