import React from 'react';
import { isRelease } from '../../../models/beta/story';
import StoryPropTypes from '../../shapes/story';

const CollapsedStoryTitle = ({ story }) => (
  <div className="Story__title">
    {story.title}
    {story.ownedByInitials ? (
      <abbr className="Story__initials" title={story.ownedByName}>
        {story.ownedByInitials}
      </abbr>
    ) : null}
    {isRelease(story) ? (
      story.releaseDate ? (
        <span>{I18n.l('date.formats.short', story.releaseDate)}</span>
      ) : null
    ) : null}
  </div>
);

CollapsedStoryTitle.propTypes = {
  story: StoryPropTypes,
};

export default CollapsedStoryTitle;
