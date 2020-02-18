import React from "react";
import StoryItem from "../story/StoryItem";
import PropTypes from 'prop-types';
import StoryPropTypes from '../shapes/story';
import { Droppable } from 'react-beautiful-dnd';

const Stories = ({ stories, from, sprintIndex, columnId, isDropDisabled }) => (
  <Droppable
    droppableId={JSON.stringify({ columnId, sprintIndex })}
    isDropDisabled={isDropDisabled}
  >
    {provided => (
      <div
        className="Column__body"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {stories.map((story, index) => (
          <StoryItem
            key={story.id}
            story={story}
            from={from}
            index={index}
            sprintIndex={sprintIndex}
            columnId={columnId}
          />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

Stories.propTypes = {
  stories: PropTypes.arrayOf(StoryPropTypes),
  from: PropTypes.string,
  isDropDisabled: PropTypes.bool.isRequired,
  columnId: PropTypes.string,
  sprintIndex: PropTypes.number
};

export default Stories;
