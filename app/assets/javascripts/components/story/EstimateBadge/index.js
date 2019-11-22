import React from 'react';
import StoryIcon from '../StoryIcon';
import StoryEstimate from './StoryEstimate';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import StoryPropTypesShape from '../../shapes/story';

const EstimateBadge = ({
  story
}) =>
  <div className='Story__icons-block'>
    <StoryIcon storyType={story.storyType} />
    <StoryEstimate estimate={story.estimate} />
    <StoryDescriptionIcon description={story.description} />
  </div>

EstimateBadge.propTypes = {
  story: StoryPropTypesShape
};

export default EstimateBadge;
