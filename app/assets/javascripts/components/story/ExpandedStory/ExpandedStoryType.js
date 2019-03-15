import React from 'react';
import PropTypes from 'prop-types';
import { types, editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

export const ExpandedStoryType = ({ story, onEdit }) =>
  <ExpandedStorySection
    title={I18n.t('activerecord.attributes.story.story_type')}
  >
    <select
      value={story._editing.storyType}
      className="form-control input-sm"
      onChange={(event) => onEdit({ storyType: event.target.value })}
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
  onEdit: PropTypes.func.isRequired
};

export default ExpandedStoryType;
