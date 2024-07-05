import PropTypes from 'prop-types';

export const projectBoardPropTypesShape = PropTypes.shape({
  error: PropTypes.oneOf([PropTypes.object, PropTypes.array]),
  isFetched: PropTypes.bool.isRequired,
});

export default projectBoardPropTypesShape;
