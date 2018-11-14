import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStoryTitle from './CollapsedStoryTitle'
import CollapsedStoryLabels from './CollapsedStoryLabels'

const CollapsedStoryInfo = ({ title, labels, ownedByName, ownedByInitials }) => (
  <div className="Story__info">
    <CollapsedStoryLabels labels={labels} />
    <CollapsedStoryTitle title={title} ownedByInitials={ownedByInitials} ownedByName={ownedByName} />
  </div>
);

CollapsedStoryInfo.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.string,
};

CollapsedStoryInfo.defaultProps = {
  labels: '',
};

export default CollapsedStoryInfo;
