import React from 'react';
import PropTypes from 'prop-types';
import { types, editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

export const ExpandedStoryType = ({ story, onEdit, disabled }) =>
  <ExpandedStorySection
    title={I18n.t('activerecord.attributes.story.story_type')}
  >
    <select
      value={story._editing.storyType}
      className="form-control input-sm"
      onChange={(event) => onEdit(event.target.value)}
      disabled={disabled}
    >
      {
        types.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))
      }
    </select>
  </ExpandedStorySection>

ExpandedStoryType.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryType;
