import React from 'react';

const ExpandedStoryControls = (props) => {
  const { onCancel, onSave } = props;

  return (
    <div className="form-group Story__controls">
      <input className="save"
        onClick={onSave}
        type="button"
        value={I18n.t('save')}
      />

      <input className="cancel"
        onClick={onCancel}
        type="button"
        value={I18n.t('cancel')}
      />
    </div>
  );
};

export default ExpandedStoryControls;
