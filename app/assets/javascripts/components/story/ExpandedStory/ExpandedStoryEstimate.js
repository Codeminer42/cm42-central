import React from 'react';
import PropTypes from 'prop-types';
import { isFeature, editingStoryPropTypesShape } from '../../../models/beta/story';
import { projectPropTypesShape } from '../../../models/beta/project';
import ExpandedStorySection from './ExpandedStorySection';

const extractValue = (event) => {
  const parsedValue = parseInt(event.target.value);

  if(isNaN(parsedValue)) {
    return null;
  }

  return parsedValue
}

const ExpandedStoryEstimate = ({ project, story, onEdit, disabled }) =>
  <ExpandedStorySection
    title={I18n.t('activerecord.attributes.story.estimate')}
  >
    <select
      value={story._editing.estimate}
      className="form-control input-sm"
      onChange = {(event) => onEdit(extractValue(event))}
      disabled={disabled || !isFeature(story._editing)}
    >
      <option value=''>
        {I18n.t('story.no_estimate')}
      </option>
      {
        project.pointValues.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))
      }
    </select>
  </ExpandedStorySection>

ExpandedStoryEstimate.propTypes = {
  project: projectPropTypesShape.isRequired,
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryEstimate;
