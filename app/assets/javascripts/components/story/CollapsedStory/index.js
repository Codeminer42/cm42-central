import React from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import StoryPopover from '../StoryPopover';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import CollapsedStoryEstimate from './CollapsedStoryEstimate';
import CollapsedStoryStateActions from './CollapsedStoryStateActions';
import CollapsedStoryInfo from './CollapsedStoryInfo';
import StoryIcon from '../StoryIcon';
import * as StoryModel from '../../../models/beta/story';

const classNameStory = (storyType, estimate) => {

  const isStoryNotEstimated = StoryModel.isStoryNotEstimated(storyType, estimate);
  const isRelease = StoryModel.isRelease(storyType);

  return classname({
    'Story--release': isRelease,
    'Story--unestimated': isStoryNotEstimated,
    'Story--estimated': !isStoryNotEstimated
  });
};

export const CollapsedStory = (props) => {
  const { onToggle, story } = props;
  
  return (
    <div
      className={`Story Story--collapsed ${classNameStory(story.storyType, story.estimate)}`}
      onClick={onToggle}
    >
      <StoryPopover story={story}>
        <div className='Story__icons-block'>
          <StoryIcon storyType={story.storyType} />
          <CollapsedStoryEstimate estimate={story.estimate} />
          <StoryDescriptionIcon description={story.description} />
        </div>
      </StoryPopover>

      <CollapsedStoryInfo story={story} />

      <CollapsedStoryStateActions story={story} />
    </div>
  );
};

CollapsedStory.propTypes = {
  story: PropTypes.object.isRequired
};

export default CollapsedStory;
