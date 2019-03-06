import React, { Component } from 'react';

class ExpandedStoryControls extends Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleDelete() {
    const { onDelete } = this.props;

    if (window.confirm(I18n.t('story destroy confirm'))){
      onDelete();
    }
  }

  handleCancel() {
    const { onCancel, isDirty } = this.props;

    if (isDirty && !this.hasUnsavedChanges()) {
      return;
    }
    onCancel();
  }

  hasUnsavedChanges() {
    return window.confirm(I18n.t('story unsaved changes'));
  }

  render() {
    const { onSave, canSave, canDelete } = this.props;

    return (
      <div className="form-group Story__controls">
        <input className="save"
          onClick={onSave}
          type="button"
          value={I18n.t('save')}
          disabled={!canSave}
        />

        <input className="delete"
          onClick={this.handleDelete}
          type="button"
          value={I18n.t('delete')}
          disabled={!canDelete}
        />

        <input className="cancel"
          onClick={this.handleCancel}
          type="button"
          value={I18n.t('cancel')}
        />
      </div>
    );
  }
};

export default ExpandedStoryControls;
