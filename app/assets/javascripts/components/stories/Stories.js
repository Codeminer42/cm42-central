import React, { Fragment } from "react";
import StoryItem from "../story/StoryItem";

const Stories = ({ stories }) => {
  if (!stories.length) {
    return null;
  }

  return (
    <Fragment>
      {stories.map(story => (
        <StoryItem key={story.id} story={story} />
      ))}
    </Fragment>
  );
};

export default Stories;
