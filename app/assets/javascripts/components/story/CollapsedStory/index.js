import React from 'react';
import classname from 'classnames';
import StoryPopover from '../StoryPopover';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import CollapsedStoryEstimate from './CollapsedStoryEstimate';
import CollapsedStoryStateActions from './CollapsedStoryStateActions';
import CollapsedStoryInfo from './CollapsedStoryInfo';
import StoryIcon from '../StoryIcon';
import * as Story from '../../../models/beta/story';
import { updateCollapsedStory } from '../../../actions/story';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const storyClassName = (storyType, estimate) => {
  const isStoryNotEstimated = Story.isStoryNotEstimated(storyType, estimate);
  const isRelease = Story.isRelease(storyType);

  return classname({
    'Story--release': isRelease,
    'Story--unestimated': isStoryNotEstimated,
    'Story--estimated': !isStoryNotEstimated
  });
};

export const CollapsedStory = ({ onToggle, story, updateCollapsedStory, project }) =>
  <div
    className={`Story Story--collapsed ${storyClassName(story.storyType, story.estimate)}`}
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

    <CollapsedStoryStateActions story={story}
      onUpdate={(newAttributes) =>
        updateCollapsedStory(story.id, project.id, newAttributes)}
    />
  </div>

CollapsedStory.propTypes = {
  story: Story.storyPropTypesShape,
  onToggle: PropTypes.func.isRequired
};

export default connect(
  ({ project }) => ({ project }),
  { updateCollapsedStory }
)(CollapsedStory);
