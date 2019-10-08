import React from 'react';

const disableToggle = event => {
  event.stopPropagation();
}

const CollapsedStoryFocusButton = ({ onClick }) =>
  <span onClick={disableToggle}>
    <button type="button" className="btn btn-default locate-btn" onClick={onClick}>
        <i className="mi md-gps-fixed md-14">gps_fixed</i>
      </button>
  </span>

export default CollapsedStoryFocusButton
