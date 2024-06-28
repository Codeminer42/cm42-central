import PropTypes from 'prop-types';

const sprintPropTypesShape = PropTypes.shape({
  number: PropTypes.number,
  startDate: PropTypes.string,
  points: PropTypes.number,
  completedPoints: PropTypes.number,
  stories: PropTypes.array,
  isFiller: PropTypes.bool,
  remainingPoints: PropTypes.bool,
});

export default sprintPropTypesShape;
