import React from 'react';
import PropTypes from 'prop-types';
import Sprint from './Sprint';
import { Droppable } from 'react-beautiful-dnd';
import { isEmpty } from 'underscore';

const propTypes = {
  sprints: PropTypes.array,
  fetchStories: PropTypes.func,
  columnId: PropTypes.string
};

const defaultProps = {
  sprints: [],
};

const renderSprints = (sprints, fetchStories, columnId) => (
  sprints.map(
    (sprint, index) => (
      <Sprint
        key={sprint.number}
        sprint={sprint}
        sprintIndex={index}
        columnId={columnId}
        fetchStories={fetchStories}
      />
    )
  )
)

const droppableContainer = columnId => (
  <Droppable droppableId={JSON.stringify({columnId, sprintIndex: 0})} isDropDisabled={columnId === 'done'}>
    {provided => (
      <div className='Sprints' ref={provided.innerRef} {...provided.droppableProps}>
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);


const Sprints = ({ sprints, fetchStories, columnId }) => (
  <div className='Sprints'>
    {
      isEmpty(sprints)
        ? droppableContainer(columnId)
        : renderSprints(sprints, fetchStories, columnId)
    }
  </div>
);

Sprint.propTypes = propTypes;
Sprint.defaultProps = defaultProps;

export default Sprints;
