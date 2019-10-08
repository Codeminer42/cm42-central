import React, { Fragment } from "react";
import StoryItem from "../story/StoryItem";

const Stories = ({ stories, search = false }) => {
  if (!stories.length) {
    return null;
  }

  return (
    <Fragment>
      {stories.map(story => (
        <StoryItem key={story.id} story={story} search={search} />
      ))}
    </Fragment>
  );
};

export default Stories;
