import React from 'react'
import PropTypes from 'prop-types';

const CollapsedStoryStateButton = ({ action, onUpdate }) => (
  <button type="button"
    className={`Story__btn Story__btn--${action}`}
    onClick={onUpdate}
  >
    {I18n.t(`story.events.${action}`)}
  </button>
);

CollapsedStoryStateButton.propTypes = {
  action: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default CollapsedStoryStateButton;
