import React from 'react';

const ExpandedStoryControls = (props) => {
  const { onCancel } = props;

  return (
    <div className="form-group Story__controls">
      <input className="cancel" onClick={onCancel} type="button" value={I18n.translate('cancel')} />
    </div>
  );
};

export default ExpandedStoryControls;
