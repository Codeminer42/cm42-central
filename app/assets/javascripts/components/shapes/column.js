import PropTypes from "prop-types";

const columnShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  renderAction: PropTypes.func,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func
});

export default columnShape;
