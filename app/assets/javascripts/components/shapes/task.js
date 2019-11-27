import PropTypes from 'prop-types';

const taskPropTypesShape = PropTypes.shape({
  id: PropTypes.number,
  storyId: PropTypes.number,
  name: PropTypes.string,
  done: PropTypes.bool,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
});

export default taskPropTypesShape;
