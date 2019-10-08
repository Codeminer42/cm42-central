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

const calculatePosition = (upperStory, bellowStory, storiesArray, index) => {
  if (bellowStory === undefined) {
    return (Number(storiesArray[index].position) + 1)
  }else if (upperStory !== undefined && bellowStory !== undefined) {
    return (Number(bellowStory.position) + Number(upperStory.position)) / 2;
  }else if (upperStory === undefined) {
    return (Number(storiesArray[index].position) - 1);
  }
}

const notGoingFoward = (storySource, dragIndex, hoverIndex, calculatedPosition, hoverClientY, hoverMiddleY) => {
  if (storySource.index === hoverIndex) {
    return true
  }

  if(storySource.position === calculatedPosition) {
    return true
  }

  if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    return true
  }

  if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    return true
  }
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
      if(!ref.current) return;

      if(state === 'accepted') return;

      const storySource = monitor.getItem();

      if (storySource.column !== column) return;

      const hoverIndex = index

      let storiesArray = storySource.stories;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      let upperStory;
      let bellowStory;
      if(item.index > index) {
        upperStory = storiesArray[index - 1]
        bellowStory = story
      } else {
        bellowStory = storiesArray[index + 1]
        upperStory = story
      }

      if (notGoingFoward(ref, story.state, storySource, hoverIndex, calculatedPosition, hoverClientY, hoverMiddleY, column)) return;

      let calculatedPosition = calculatePosition(upperStory, bellowStory, storiesArray, index);

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
  className: PropTypes.string,
  index: PropTypes.number,
  stories: PropTypes.array,
  column: PropTypes.string
}

export default connect(
  ({ project }) => ({ project }),
  { dragDropStory, updateCollapsedStory }
)(CollapsedStory)
