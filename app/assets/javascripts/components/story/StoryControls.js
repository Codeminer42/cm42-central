/* eslint react/prop-types:"off" */
import React from 'react';

const StoryControls = props => (
  <div className="form-group story-controls">
    <input className="submit" onClick={props.onClickSave} type="button" value="Save" />
    <input className="destroy" onClick={props.onClickDelete} type="button" value="Delete" />
    <input className="cancel" onClick={props.onClickCancel} type="button" value="Cancel" />
  </div>
);

export default StoryControls;
