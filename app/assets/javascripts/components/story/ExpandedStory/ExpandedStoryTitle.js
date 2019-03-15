import React from 'react';
import PropTypes from 'prop-types';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

const ExpandedStoryTitle = ({ story, onEdit, titleRef }) =>
  <ExpandedStorySection
    title={I18n.t('activerecord.attributes.story.title')}
  >
    <input
      value={story._editing.title}
      ref={titleRef}
      className="form-control input-sm"
      onChange={(event) => onEdit(event.target.value)}
    />
  </ExpandedStorySection>

ExpandedStoryTitle.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ExpandedStoryTitle
