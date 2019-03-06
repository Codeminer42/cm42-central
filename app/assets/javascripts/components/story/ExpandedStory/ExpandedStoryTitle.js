import React from 'react';
import PropTypes from 'prop-types';
import { editingStoryPropTypesShape } from '../../../models/beta/story';

const ExpandedStoryTitle = (props) => {

  const { story, onEdit, titleRef } = props;

  return (
    <div className="Story__section">
      <div className="Story__section-title">
        {I18n.t('activerecord.attributes.story.title')}
      </div>
      <input
        value={story._editing.title}
        ref={titleRef}
        className="form-control input-sm"
        onChange={(event) => onEdit(event.target.value)}
      />
    </div>
  );
};

ExpandedStoryTitle.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ExpandedStoryTitle
