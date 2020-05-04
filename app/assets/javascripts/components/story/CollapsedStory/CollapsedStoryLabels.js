import React from 'react'
import PropTypes from 'prop-types'
import * as Labels from '../../../models/beta/label';
import StoryPropTypes from '../../shapes/story';

const StoryLabel = ({ label, onClick }) => (
  <a href="#" className="Story__label" onClick={onClick} title={label}>{label}</a>
);

StoryLabel.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

const CollapsedStoryLabels = ({ story, onClickLabel }) => {
  if (!story.labels) {
    return null
  }

  return (
    <span className='Story__labels'>
      {Labels.getNames(story.labels).map(label => (
        <StoryLabel key={label} label={label} onClick={e => onClickLabel(e, label)} />
      ))}
    </span>
  );
};

CollapsedStoryLabels.propTypes = {
  story: StoryPropTypes,
  onClickLabel: PropTypes.func.isRequired
};

export default CollapsedStoryLabels;
