import PropTypes from 'prop-types';

const notePropTypesShape = PropTypes.shape({
  id: PropTypes.number,
  note: PropTypes.string,
  userId: PropTypes.number,
  storyId: PropTypes.number,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  userName: PropTypes.string,
  errors: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
});

export default notePropTypesShape;
