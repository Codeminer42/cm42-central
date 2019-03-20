import React from 'react'
import { storyPropTypesShape } from '../../../models/beta/story';

const CollapsedStoryTitle = ({ story }) => (
  <div className="Story__title">
    {story.title}
    {
      story.ownedByInitials
        ? <abbr
          className="Story__initials"
          title={story.ownedByName}
        >
          {story.ownedByInitials}
        </abbr>
        : null
    }
    {
      story.storyType === 'release'
        ? story.releaseDate
          ? <span>{I18n.l("date.formats.short", story.releaseDate)}</span>
          : null
        : null
    }
  </div>
);

CollapsedStoryTitle.propTypes = {
  story: storyPropTypesShape
};


export default CollapsedStoryTitle
