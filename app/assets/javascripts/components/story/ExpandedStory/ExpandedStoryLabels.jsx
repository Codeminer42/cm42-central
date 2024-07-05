import React from 'react';
import ReactTags from 'react-tag-autocomplete';
import PropTypes from 'prop-types';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

function ExpandedStoryLabels({
  story,
  projectLabels,
  disabled,
  onRemoveLabel,
  onAddLabel,
}) {
  const { labels } = story._editing;

  if (disabled && !story.labels.length) return null;

  const onDelete = index => {
    if (disabled) return;

    const label = labels.find((_, labelIndex) => labelIndex === index);

    onRemoveLabel(label.name);
  };

  return (
    <ExpandedStorySection
      title={I18n.t('activerecord.attributes.story.labels')}
    >
      <ReactTags
        tags={labels}
        placeholder={disabled ? '' : I18n.t('add new label')}
        suggestions={projectLabels}
        inputAttributes={{ readOnly: disabled }}
        delimiterChars={[',', ' ']}
        allowNew={!disabled}
        allowBackspace={false}
        autoresize={false}
        autofocus={false}
        addOnBlur={true}
        handleAddition={onAddLabel}
        handleDelete={onDelete}
      />
    </ExpandedStorySection>
  );
}

ExpandedStoryLabels.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onAddLabel: PropTypes.func.isRequired,
  onRemoveLabel: PropTypes.func.isRequired,
  projectLabels: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default ExpandedStoryLabels;
