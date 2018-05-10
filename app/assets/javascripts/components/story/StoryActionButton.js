import React from 'react'

const StoryActionButton = (props) => {
  return (
    <button
      className={`btn btn-default ${props.className}`}
      title={props.title}>
      <i className="mi md-18">{props.iconName}</i>
    </button>
  );
};

export default StoryActionButton;
