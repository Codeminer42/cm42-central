import React from 'react';

const ExpandedStoryControls = ({ onCancel, onSave, onDelete, readOnly }) => {
  return (
    <div className="form-group Story__controls">
      <input className="save"
        onClick={onSave}
        type="button"
        value={I18n.t('save')}
        disabled={readOnly}
      />

      <input className="delete"
        onClick={() => {
          if (window.confirm(I18n.t('story destroy confirm'))){
            onDelete();
          }
        }}
        type="button"
        value={I18n.t('delete')}
        disabled={readOnly}
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
