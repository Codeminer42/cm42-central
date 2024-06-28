import PropTypes from 'prop-types';

export const sideBarButtonShape = PropTypes.shape({
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  'data-id': PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
});

export default sideBarButtonShape;
