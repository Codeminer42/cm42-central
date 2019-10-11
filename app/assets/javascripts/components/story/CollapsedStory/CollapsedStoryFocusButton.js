import React from 'react';
import PropTypes from 'prop-types';

const CollapsedStoryFocusButton = ({ onClick }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    return onClick(e);
  };

  return (
    <button type="button" className="btn btn-default locate-btn" onClick={handleClick}>
      <i className="mi md-gps-fixed md-14">gps_fixed</i>
    </button>
  )
}

CollapsedStoryFocusButton.propTypes = {
  onClick: PropTypes.func.isRequired
};


export default CollapsedStoryFocusButton
