import React from 'react';
import PropTypes from 'prop-types';

const DefaultPoints = ({ points, completedPoints }) => (
  <div className="default-points">
    {completedPoints > 0 && `${completedPoints} / `}
    {points}
  </div>
);

const expandedStyle = (hasStories, isClosed) =>
  hasStories && !isClosed ? 'Sprint__icon--expanded' : '';

const DonePoints = ({ points, hasStories, isClosed }) => (
  <div>
    <span className="done-points">{points > 0 && points}</span>
    <i
      className={`Sprint__icon ${expandedStyle(hasStories, isClosed)} mi md-16`}
    >
      {hasStories ? 'chevron_right' : 'remove'}
    </i>
  </div>
);

const SprintHeader = props => (
  <div className="Sprint__header" onClick={props.onClick}>
    {props.number} - {I18n.l('date.formats.long', props.startDate)}
    {props.isDone ? (
      <DonePoints
        hasStories={props.hasStories}
        points={props.points}
        isClosed={props.isClosed}
      />
    ) : (
      <DefaultPoints
        points={props.points}
        completedPoints={props.completedPoints}
      />
    )}
  </div>
);

SprintHeader.propTypes = {
  onClick: PropTypes.func.isRequired,
  number: PropTypes.number.isRequired,
  startDate: PropTypes.string.isRequired,
  isDone: PropTypes.bool.isRequired,
  hasStories: PropTypes.bool,
  points: PropTypes.number.isRequired,
  isClosed: PropTypes.bool.isRequired,
  completedPoints: PropTypes.number,
};

export default SprintHeader;
