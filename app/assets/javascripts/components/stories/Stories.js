import React, { Fragment } from "react";
import StoryItem from "../story/StoryItem";

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

export default Stories;
