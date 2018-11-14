import React from 'react'
import PropTypes from 'prop-types'

const CollapsedStoryTitle = ({ title, ownedByInitials, ownedByName }) => (
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

CollapsedStoryTitle.propTypes = {
  title: PropTypes.string.isRequired,
  ownedByName: PropTypes.string,
  ownedByInitials: PropTypes.string,
};


export default CollapsedStoryTitle
