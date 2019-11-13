import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { editingStoryPropTypesShape } from '../../../../models/beta/story';
import ExpandedStorySection from '../ExpandedStorySection';
import ExpandedStoryContentArea from './ExpandedStoryContentArea';
import ExpandedStoryDescriptionTextArea from './ExpandedStoryDescriptionTextArea';

const ExpandedStoryDescription = ({
  disabled,
  onEdit,
  users,
  story
}) => {
  if (disabled && !story.description) return null;

  const [editing, setEditing] = useState(false);
  const toggleField = () => setEditing(!editing);

  return (
    <ExpandedStorySection
      title={I18n.t('activerecord.attributes.story.description')}
      identifier="description"
    >
      {
        editing
          ? <ExpandedStoryDescriptionTextArea 
              description={story._editing.description || undefined}
              onEdit={onEdit}
              disabled={disabled}
              users={users}
              data-id="text-area"
            />
          : (
            <ExpandedStoryContentArea
              onClick={toggleField}
              description={story.description}
            />
          )
      }
    </ExpandedStorySection>
  )
};

ExpandedStoryDescription.defaultProps = {
  users: [],
};

ExpandedStoryDescription.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryDescription;
