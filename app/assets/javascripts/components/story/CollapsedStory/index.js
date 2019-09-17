import React, { useRef } from 'react'
import classname from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import StoryPopover from '../StoryPopover'
import StoryDescriptionIcon from '../StoryDescriptionIcon'
import CollapsedStoryEstimate from './CollapsedStoryEstimate'
import CollapsedStoryStateActions from './CollapsedStoryStateActions'
import CollapsedStoryInfo from './CollapsedStoryInfo'
import StoryIcon from '../StoryIcon'
import * as Story from '../../../models/beta/story'
import { dragDropStory, updateCollapsedStory } from '../../../actions/story'
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
  hover(props, monitor) {
    const story = monitor.getItem();

    const upperStory = story.stories[props.index - 1];

    const dragIndex = story.index
    const hoverIndex = props.index

    if (dragIndex === hoverIndex) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = document.querySelector(".story-container").getBoundingClientRect()
    // Get vertical middle
    const hoverMiddleY =
      (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    // Determine mouse position
    const clientOffset = monitor.getClientOffset()
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }

    let calculatedPosition;

    if (upperStory !== undefined) {
      calculatedPosition = (Number(props.story.position) + Number(upperStory.position)) / 2;
    } else if (upperStory === undefined) {
      calculatedPosition = (Number(story.stories[props.index].position) + 1);
    }

    console.log(calculatedPosition);

    props.dragDropStory(story.id, story.projectId, { position: calculatedPosition });
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
  dragDropStory,
  project,
  className,
  title,
  isDragging,
  connectDragSource,
  connectDropTarget
}) => {
  const ref = useRef(null);
  return connectDropTarget(connectDragSource(
    <div
      ref={ref}
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
          dragDropStory(story.id, project.id, newAttributes)
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
  { dragDropStory, updateCollapsedStory }
)(DropTarget(type.story, storyTarget, collectTarget)(DragSource(type.story, storySource, collectSource)(CollapsedStory)))
