import React, { useRef, useState } from 'react'
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
  let calculatedPosition;
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: type.story,
    hover(item, monitor) {
      if(!ref.current) {
        return
      }

      const storySource = monitor.getItem();
            
      let dragIndex = storySource.index
      const hoverIndex = index

      let array = storySource.stories;

      if(storySource.state === 'unscheduled'){
        array = stories
      }

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

      let upperStory;
      let bellowStory;
      if(item.index > index){
        upperStory = array[index - 1]
        bellowStory = story
      }else{
        bellowStory = array[index + 1]
        upperStory = story
      }

      console.log("down:", bellowStory)
      console.log("up:", upperStory)

      if (bellowStory === undefined) {
        calculatedPosition = (Number(item.stories[index].position) + 1)
      }else if (upperStory !== undefined && bellowStory !== undefined) {
        calculatedPosition = (Number(bellowStory.position) + Number(upperStory.position)) / 2;
      } else if (upperStory === undefined) {
        calculatedPosition = (Number(item.stories[index].position) - 1);
      }
      moveTask(dragIndex, hoverIndex, storySource);  

      item.index = hoverIndex
    }
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: type.story, calculatedPosition},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    begin() {
      return { ...story, index, stories, calculatedPosition }
    },
    end(item, monitor) {
      const storySource = monitor.getItem()
      const dragPosition = item.position
      const hoverStory = stories[index]

      if(item.state === "unscheduled"){
        dragDropStory(item.id, item.projectId, {state: 'unstarted'})
      }
      
      dragDropStory(item.id, item.projectId, {position: item.calculatedPosition})

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
