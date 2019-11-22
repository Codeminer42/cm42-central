import React from 'react';
import StoryPopover from '../StoryPopover';
import StoryIcon from '../StoryIcon';
import StoryEstimate from './StoryEstimate';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import StoryPropTypesShape from '../../shapes/story';

const EstimateBadge = ({
  story
}) =>
  <StoryPopover story={story}>
    <div className='Story__icons-block'>
      <StoryIcon storyType={story.storyType} />
      <StoryEstimate estimate={story.estimate} />
      <StoryDescriptionIcon description={story.description} />
    </div>
  </StoryPopover>

EstimateBadge.propTypes = {
  story: StoryPropTypesShape
};

export default EstimateBadge;
