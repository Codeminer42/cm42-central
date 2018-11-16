import React from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import StoryPopover from '../StoryPopover';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import CollapsedStoryEstimate from './CollapsedStoryEstimate';
import CollapsedStoryStateActions from './CollapsedStoryStateActions';
import CollapsedStoryInfo from './CollapsedStoryInfo';
import CollapsedStoryIcon from './CollapsedStoryIcon';

import {
  isStoryNotEstimated,
  isRelease,
} from '../../../rules/story';

const classNameStory = (storyType, estimate) => classname(
  'Story',
  {
    'Story--unestimated': isStoryNotEstimated(storyType, estimate),
    'Story--estimated': !isStoryNotEstimated(storyType, estimate),
    'Story--release': isRelease(storyType)
  }
);

const CollapsedStory = ({ story }) => (
  <div className={classNameStory(story.storyType, story.estimate)}>
    <StoryPopover story={story}>
      <div className='Story__icons-block'>
        <CollapsedStoryIcon storyType={story.storyType} />
        <CollapsedStoryEstimate estimate={story.estimate} />
        <StoryDescriptionIcon description={story.description} />
      </div>
    </StoryPopover>

    <CollapsedStoryInfo story={story}/>

    <CollapsedStoryStateActions story={story}/>
  </div>
);

CollapsedStory.propTypes = {
  story: PropTypes.object.isRequired
};

export default CollapsedStory;
