import PropTypes from "prop-types";

const attachmentPropTypesShape = PropTypes.shape({
  publicId: PropTypes.string,
  version: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  format: PropTypes.string,
  resourceType: PropTypes.string,
  path: PropTypes.string
});

export default attachmentPropTypesShape;
