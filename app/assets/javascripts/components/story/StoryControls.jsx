import React from 'react';

const StoryControls = (props) => {
  return(
    <div className="form-group story-controls">
    { !props.disableChanges && <input className="submit" onClick={props.onClickSave} type="button" value="Save" /> }
    { !props.disableChanges && <input className="destroy" onClick={props.onClickDelete} type="button" value="Delete" /> }
    <input className="cancel" onClick={props.onClickCancel} type="button" value="Cancel" />
    </div>
  );
};

export default StoryControls;
