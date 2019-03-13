import React from 'react'
import { storyPropTypesShape } from '../../../models/beta/story';

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
  story: storyPropTypesShape
};


export default CollapsedStoryTitle
