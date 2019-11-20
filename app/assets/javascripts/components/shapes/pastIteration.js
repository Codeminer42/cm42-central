import PropTypes from 'prop-types';

const pastIterationPropTypesShape = PropTypes.shape({
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  iterationNumber: PropTypes.number,
  stories: PropTypes.array,
  storyIds: PropTypes.array,
  points: PropTypes.number,
  fetched: PropTypes.bool,
  isFetching: PropTypes.bool
});

export default pastIterationPropTypesShape;
