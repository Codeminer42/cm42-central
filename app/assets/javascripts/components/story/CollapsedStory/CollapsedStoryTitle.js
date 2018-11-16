import React from 'react'
import PropTypes from 'prop-types'

const CollapsedStoryTitle = ({ story }) => (
  <div className="Story__title">
    {story.title}
    <abbr
      className="Story__initials"
      title={story.ownedByName}
    >
      {story.ownedByInitials}
    </abbr>
  </div>
);

CollapsedStoryTitle.propTypes = {
  story: PropTypes.object.isRequired,
};


export default CollapsedStoryTitle
