import React from 'react'
import classname from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import StoryPopover from '../StoryPopover'
import StoryDescriptionIcon from '../StoryDescriptionIcon'
import CollapsedStoryEstimate from './CollapsedStoryEstimate'
import CollapsedStoryStateActions from './CollapsedStoryStateActions'
import CollapsedStoryInfo from './CollapsedStoryInfo'
import StoryIcon from '../StoryIcon'
import * as Story from '../../../models/beta/story'
import { moveStoryColumn, updateCollapsedStory } from '../../../actions/story'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const storyClassName = (story, additionalClassname = '') => {
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
      'Story--estimated': !isStoryNotEstimated
    },
    additionalClassname
  )
}

const type = {
  story: 'STORY'
}

const storySource = {
  beginDrag({ story, index, stories }) {
    return { ...story, index, stories }
  },
}

const storyTarget = {
  hover(props, monitor, component) {
    const story = monitor.getItem();
    const upperStory = story.stories[props.index - 1];
    const calculatedPosition = (Number(props.story.position) + Number(upperStory.position)) / 2;
    updateCollapsedStory(story.id, story.projectId, { position: calculatedPosition });
  },
}

const collectSource = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const collectTarget = (connect) => {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

export const CollapsedStory = ({
  onToggle,
  story,
  moveStoryColumn,
  project,
  className,
  title,
  isDragging,
  connectDragSource,
  connectDropTarget
}) => {
  return connectDropTarget(connectDragSource(
    <div
      className={storyClassName(story, className)}
      onClick={onToggle}
      title={title}
      style={{
        opacity: isDragging ? 0 : 1
      }}
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
          moveStoryColumn(story.id, project.id, newAttributes)
        }
      />
    </div>
  ))
}

CollapsedStory.propTypes = {
  story: Story.storyPropTypesShape,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string
}

export default connect(
  ({ project }) => ({ project }),
  { moveStoryColumn }
)(DropTarget(type.story, storyTarget, collectTarget)(DragSource(type.story, storySource, collectSource)(CollapsedStory)))
