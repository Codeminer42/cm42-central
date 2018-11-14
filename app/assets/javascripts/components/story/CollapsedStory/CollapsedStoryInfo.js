import React from 'react';
import PropTypes from 'prop-types';
import { labelSplit } from '../../../rules/story';

const CollapsedStoryInfo = ({ title, labels, ownedByName, ownedByInitials }) => (
  <div className="Story__info">
    <StoryLabels labels={labels} />
    <StoryTitle title={title} ownedByInitials={ownedByInitials} ownedByName={ownedByName} />
  </div>
);

CollapsedStoryInfo.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.string,
};

CollapsedStoryInfo.defaultProps = {
  labels: '',
};

const StoryLabel = ({ label }) => (
  <a href="#" className="Story__label" title={label}>{label}</a>
);

StoryLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

const StoryLabels = ({ labels }) => {
  if (!labels) {
    return null
  }

  return (
    <span className='Story__labels'>
      {labelSplit(labels).map(label => (
        <StoryLabel key={label} label={label} />
      ))}
    </span>
  );
};

export const StoryTitle = ({ title, ownedByInitials, ownedByName }) => (
  <div className="Story__title">
    {title}
    <abbr
      className="Story__initials"
      title={ownedByName}
    >
      {ownedByInitials}
    </abbr>
  </div>
);

StoryTitle.propTypes = {
  title: PropTypes.string.isRequired,
  ownedByName: PropTypes.string,
  ownedByInitials: PropTypes.string,
};


export default CollapsedStoryInfo;
