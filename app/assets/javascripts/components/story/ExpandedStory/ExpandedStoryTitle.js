import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ExpandedStoryTitle = (props) => {

  const { story, onEdit } = props;

  return (
    <div className="Story__section">
      <div className="Story__section-title">
        {I18n.t('activerecord.attributes.story.title')}
      </div>
      <input
        value={story._editing.title}
        className="form-control input-sm"
        onChange={(event) => onEdit(event.target.value)}
      />
    </div>
  );
};

ExpandedStoryTitle.propTypes = {
  story: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default ExpandedStoryTitle
