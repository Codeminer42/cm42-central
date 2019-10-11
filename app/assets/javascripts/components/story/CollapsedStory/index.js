import React from 'react';
import classname from 'classnames';
import StoryPopover from '../StoryPopover';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import CollapsedStoryEstimate from './CollapsedStoryEstimate';
import CollapsedStoryStateActions from './CollapsedStoryStateActions';
import CollapsedStoryInfo from './CollapsedStoryInfo';
import StoryIcon from '../StoryIcon';
import * as Story from '../../../models/beta/story';
import { updateCollapsedStory, highlight } from '../../../actions/story';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CollapsedStoryFocusButon from './CollapsedStoryFocusButton';
import { storyPropTypesShape } from './../../../models/beta/story';

const storyClassName = (story, additionalClassname = '') => {
  const isStoryNotEstimated = Story.isStoryNotEstimated(story.storyType, story.estimate);
  const isRelease = Story.isRelease(story);

  return classname(
    'Story Story--collapsed',
    {
      'Story--release': isRelease,
      'Story--unestimated': isStoryNotEstimated,
      'Story--estimated': !isStoryNotEstimated
    },
    additionalClassname
  );
};

export const CollapsedStory = ({ onToggle, story, updateCollapsedStory, project, className, title, from, highlight, stories = [] }) =>
  <div
    className={storyClassName(story, className)}
    onClick={onToggle}
    title={title}
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
    {
      Story.haveHighlightButton(Story.withScope(stories), story, from) && 
      <CollapsedStoryFocusButon onClick={() => highlight(story.id)} />
    }
  </div>

CollapsedStory.propTypes = {
  story: storyPropTypesShape,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  from: PropTypes.string, 
  highlight: PropTypes.func
};

export default connect(
  ({ project, stories }) => ({ project, stories }),
  { updateCollapsedStory, highlight }
)(CollapsedStory);
