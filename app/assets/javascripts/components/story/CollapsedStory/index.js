import React, { useRef, useImperativeHandle } from 'react'
import classname from 'classnames'
import { useDrag, useDrop } from 'react-dnd'
import StoryPopover from '../StoryPopover'
import StoryDescriptionIcon from '../StoryDescriptionIcon'
import CollapsedStoryEstimate from './CollapsedStoryEstimate'
import CollapsedStoryStateActions from './CollapsedStoryStateActions'
import CollapsedStoryInfo from './CollapsedStoryInfo'
import StoryIcon from '../StoryIcon'
import * as Story from '../../../models/beta/story'
import { dragDropStory, editStory, updateCollapsedStory } from '../../../actions/story'
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

export const CollapsedStory = ({
  onToggle,
  story,
  dragDropStory,
  project,
  className,
  title,
  index,
  stories,
  moveTask
}) => {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: type.story,
    hover(item, monitor) {
      if(!ref.current) {
        return
      }

      const storySource = monitor.getItem();
      const upperStory = storySource.stories[item.index - 1];
      
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()      
      // Get vertical middle   
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2    
      // Determine mouse position    
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top   
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
          // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      let calculatedPosition;

      if (upperStory !== undefined) {
        calculatedPosition = (Number(story.position) + Number(upperStory.position)) / 2;
      } else if (upperStory === undefined) {
        calculatedPosition = (Number(storySource.stories[index].position) + 1);
      }
      
      moveTask(dragIndex, hoverIndex);

      item.index = hoverIndex
    }
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: type.story,  },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    begin() {
      return { ...story, index, stories }
    }
  })
  drag(drop(ref))
  return (
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
  )
}

CollapsedStory.propTypes = {
  story: Story.storyPropTypesShape,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string
}

export default connect(
  ({ project }) => ({ project }),
  { dragDropStory, updateCollapsedStory, editStory }
)(CollapsedStory)
