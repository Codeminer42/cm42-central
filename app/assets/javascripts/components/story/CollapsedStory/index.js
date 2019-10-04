import React, { useRef } from 'react';
import classname from 'classnames';
import { useDrag, useDrop } from 'react-dnd';
import StoryPopover from '../StoryPopover';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import CollapsedStoryEstimate from './CollapsedStoryEstimate';
import CollapsedStoryStateActions from './CollapsedStoryStateActions';
import CollapsedStoryInfo from './CollapsedStoryInfo';
import StoryIcon from '../StoryIcon';
import * as Story from '../../../models/beta/story';
import { dragDropStory, updateCollapsedStory } from '../../../actions/story';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
  column
}) => {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: type.story,
    hover(item, monitor) {
      if(!ref.current) {
        return
      }

      if(story.state === 'accepted') {
        return
      }

      const storySource = monitor.getItem();

      if (storySource.column !== column) {
        return
      }

      let dragIndex = storySource.index
      const hoverIndex = index

      let array = storySource.stories;

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
      let calculatedPosition
      if (bellowStory === undefined) {
        calculatedPosition = (Number(array[index].position) + 1)
      }else if (upperStory !== undefined && bellowStory !== undefined) {
        calculatedPosition = (Number(bellowStory.position) + Number(upperStory.position)) / 2;
      }else if (upperStory === undefined) {
        calculatedPosition = (Number(array[index].position) - 1);
      }

      if(storySource.position === calculatedPosition) {
        return
      }

      dragDropStory(storySource.id, storySource.projectId, {
        position: calculatedPosition
      })
      item.index = hoverIndex
    }
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: type.story, ...story, index, stories, column},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag() {
      const storyState = story.state
      return storyState === "accepted" ? false : true
    },
    begin() {
      return { ...story, index, stories, column }
    },

    end(item, monitor) {
      const storySource = monitor.getDropResult()

      if(storySource.state === "unscheduled" && storySource.column === "backlog"){
        dragDropStory(item.id, item.projectId, {state: 'unstarted'})
      }

      if(storySource.state === "unstarted" && storySource.column === "chillyBin"){
        dragDropStory(item.id, item.projectId, {state: 'unscheduled'})
      }
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
          updateCollapsedStory(story.id, project.id, newAttributes)
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
  { dragDropStory, updateCollapsedStory }
)(CollapsedStory)
