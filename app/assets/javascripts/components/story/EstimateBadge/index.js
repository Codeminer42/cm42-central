import React from 'react';
import StoryIcon from '../StoryIcon';
import StoryEstimate from './StoryEstimate';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import StoryPropTypesShape from '../../shapes/story';

const EstimateBadge = ({
  story
}) =>
  <div className='Story__icons-block'>
    <StoryIcon data-id="story-icon" storyType={story.storyType} />
    <StoryEstimate data-id="story-estimate" estimate={story.estimate} />
    <StoryDescriptionIcon data-id="story-description-icon" description={story.description} />
  </div>

EstimateBadge.propTypes = {
  story: StoryPropTypesShape
};

export default EstimateBadge;
