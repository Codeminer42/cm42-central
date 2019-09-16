import React, { Fragment } from "react";
import StoryItem from "../story/StoryItem";

const Stories = ({ stories }) => {
  if (!stories.length) {
    return null;
  }

  return (
    <Fragment>
      {stories.map((story, index) => (
        <StoryItem key={story.id} index={index} stories={stories} story={story} />
      ))}
    </Fragment>
  );
};

export default Stories;
