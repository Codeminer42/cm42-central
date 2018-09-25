import React from "react";
import StoryItem from "../story/StoryItem";

const Stories = ({ stories }) => {
  if (!stories.length) {
    return null;
  }

  return (
    <div>
      {stories.map(story => (
        <StoryItem key={story.id} {...story} />
      ))}
    </div>
  );
};

export default Stories;
