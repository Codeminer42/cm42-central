import React, { useState } from "react";
import PropTypes from "prop-types";
import ExpandedStoryToolTip from "./ExpandedStoryToolTip";

const ExpandedStoryControls = ({
  onSave,
  onCancel,
  onDelete,
  canSave,
  canDelete,
  isDirty,
  disabled,
}) => {
  const handleDelete = () => {
    if (window.confirm(I18n.t("story destroy confirm"))) {
      onDelete();
    }
  };

  const handleCancel = () => {
    if (isDirty && !hasUnsavedChanges()) {
      return;
    }
    onCancel();
  };

  const hasUnsavedChanges = () => {
    return window.confirm(I18n.t("story unsaved changes"));
  };

  return (
    <div className="form-group Story__controls">
      <input
        className="save"
        onClick={onSave}
        type="button"
        value={I18n.t("save")}
        disabled={!canSave}
      />

      <input
        className="delete"
        onClick={handleDelete}
        type="button"
        value={I18n.t("delete")}
        disabled={!canDelete}
      />
      <input
        className="cancel"
        onClick={handleCancel}
        type="button"
        value={I18n.t("cancel")}
      />

      {disabled && <ExpandedStoryToolTip text={I18n.t("accepted_tooltip")} />}
    </div>
  );
};

ExpandedStoryControls.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  canSave: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default ExpandedStoryControls;
