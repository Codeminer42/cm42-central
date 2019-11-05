import React, { useState, useMemo } from "react";
import classname from 'classnames';
import PropTypes from "prop-types";
import Stories from "./Stories";
import SprintHeader from './SprintHeader'
import SprintPropTypes from '../shapes/iteration';
import PastIterationPropTypes from '../shapes/pastIteration';

const propTypes = {
  fetchStories: PropTypes.func,
  sprint: PropTypes.oneOfType([
    SprintPropTypes,
    PastIterationPropTypes
  ])
};

const defaultProps = {
  fetchStories: undefined,
  sprint: {
    number: 0,
    startDate: 0,
    points: 0,
    stories: []
  }
};

const Sprint = ({
  fetchStories,
  sprint,
  sprintIndex,
  columnId
}) => {
  const isDone = useMemo(() => sprint.hasOwnProperty('hasStories'), [sprint]);

  const [isClosed, setIsClosed] = useState(isDone);

  const needsFetch = () => {
    const { hasStories, fetched, isFetching } = sprint;

    return hasStories && !(fetched || isFetching);
  }

  const onHeaderClick = () => {
    const { number, startDate, endDate } = sprint;

    if (needsFetch()) fetchStories(number, startDate, endDate);

    toggleSprint();
  }

  const toggleSprint = () => setIsClosed(!isClosed);

  const {
    number,
    points,
    stories,
    startDate,
    hasStories,
    completedPoints
  } = sprint;

  const classes = classname(
    'Sprint__body',
    {
      'Sprint__body--is-collapsed': isClosed
    }
  );

  return (
    <div className="Sprint">
      <SprintHeader
        number={number}
        startDate={startDate}
        completedPoints={completedPoints}
        points={points}
        hasStories={hasStories}
        isDone={isDone}
        onClick={onHeaderClick}
        isClosed={isClosed}
      />
      <div className={classes}>
        {stories && <Stories stories={stories} columnId={columnId} sprintIndex={sprintIndex} />}
      </div>
    </div>
  );
}

Sprint.propTypes = propTypes;
Sprint.defaultProps = defaultProps;

export default Sprint;
