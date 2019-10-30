import React from 'react';
import classname from 'classnames';
import StoryPopover from '../StoryPopover';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import CollapsedStoryEstimate from './CollapsedStoryEstimate';
import CollapsedStoryStateActions from './CollapsedStoryStateActions';
import CollapsedStoryInfo from './CollapsedStoryInfo';
import StoryIcon from '../StoryIcon';
import * as Story from '../../../models/beta/story';
import { dragDropStory, updateCollapsedStory, highlight } from '../../../actions/story';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CollapsedStoryFocusButon from './CollapsedStoryFocusButton';
import { storyPropTypesShape } from './../../../models/beta/story';
import { DragDropRefs } from '../../../models/beta/dragDrop';

const storyClassName = (story, additionalClassname = '', isDragging) => {
  const isStoryNotEstimated = Story.isStoryNotEstimated(
    story.storyType,
    story.estimate
  )
  const isRelease = Story.isRelease(story)

  return classname(
    'Story Story--collapsed',
    {
      'Story--release': isRelease,
      'Story--unestimated': isStoryNotEstimated,
      'Story--estimated': !isStoryNotEstimated,
      'Story--isDragging': isDragging
    },
    additionalClassname
  )
}

export const CollapsedStory = ({
  onToggle,
  story,
  project,
  dragDropStory,
  className,
  title,
  index,
  stories,
  column,
  updateCollapsedStory,
  highlight,
  isHighlightable
}) => {
  const [ref, isDragging] = DragDropRefs(dragDropStory, index, stories, column, story);
  return (
    <div
      ref={ref}
      className={storyClassName(story, className, isDragging)}
      onClick={onToggle}
      title={title}
    >
      <StoryPopover story={story}>
        <div className="Story__icons-block">
          <StoryIcon storyType={story.storyType} />
          <CollapsedStoryEstimate estimate={story.estimate} />
          <StoryDescriptionIcon description={story.description} />
        </div>
      </StoryPopover>

      <CollapsedStoryInfo story={story} />

      <CollapsedStoryStateActions
        story={story}
        onUpdate={newAttributes =>
          updateCollapsedStory(story.id, project.id, newAttributes)
        }
      />
      {
        isHighlightable &&
        <CollapsedStoryFocusButon onClick={() => highlight(story.id)} />
      }
    </div>
  )
}

CollapsedStory.propTypes = {
  story: storyPropTypesShape,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  index: PropTypes.number,
  stories: PropTypes.arrayOf(storyPropTypesShape),
  column: PropTypes.string,
  from: PropTypes.string,
  highlight: PropTypes.func
};

const mapStateToProps = ({
  project,
  stories
}, props) => ({
  project,
  isHighlightable: Story.haveHighlightButton(Story.withScope(stories), props.story, props.from)
});

const mapDispatchToProps = { dragDropStory, updateCollapsedStory, highlight }

export default connect(
mapStateToProps, mapDispatchToProps
)(CollapsedStory)
