import React, { Fragment } from "react";
import StoryItem from "../story/StoryItem";

const Stories = ({ stories }) => {
  if (!stories.length) {
    return null;
  }

  return (
    <Fragment>
      {stories.map((story, index) => (!story.id ?

      <StoryItem key={story.id} story={story} /> :

        <Draggable
        key={story.id}
        draggableId={story.id}
        index={index}
        position={story.position}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <StoryItem key={story.id} story={story} />
          </div>
        )}
      </Draggable>
      ))}
    </Fragment>
  );
};

export default Stories;
