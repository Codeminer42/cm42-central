import React from 'react';
import PropTypes from 'prop-types';

const CollapsedStoryFocusButton = ({ onClick }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    return onClick(e);
  };

  return (
    <button 
      type="button" 
      className="btn btn-default locate-btn Story__focus-button" 
      onClick={handleClick}
      title={I18n.t('projects.search_story')}
      data-id="focus-button"
    >
      <i className="mi md-gps-fixed md-14 Story__focus-button-icon">gps_fixed</i>
    </button>
  )
}

CollapsedStoryFocusButton.propTypes = {
  onClick: PropTypes.func.isRequired
};


export default CollapsedStoryFocusButton
