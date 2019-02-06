import React from 'react'
import PropTypes from 'prop-types';

const CollapsedStoryStateButton = ({ action }) => (
  <button type="button" className={`Story__btn Story__btn--${action}`}>
    { I18n.t(`story.events.${action}`) }
  </button>
);

CollapsedStoryStateButton.propTypes = {
  action: PropTypes.string.isRequired
};

export default CollapsedStoryStateButton;
