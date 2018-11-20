import React from 'react'
import PropTypes from 'prop-types'

const labelSplit = (labels) => labels.split(',');

const StoryLabel = ( { label } ) => (
  <a href="#" className="Story__label" title={label}>{label}</a>
);

StoryLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

const CollapsedStoryLabels = ({ story }) => {
  if (!story.labels) {
    return null
  }

  return (
    <span className='Story__labels'>
      {labelSplit(story.labels).map(label => (
        <StoryLabel key={label} label={label} />
      ))}
    </span>
  );
};

CollapsedStoryLabels.propTypes = {
  story: PropTypes.object.isRequired,
};

export default CollapsedStoryLabels;
