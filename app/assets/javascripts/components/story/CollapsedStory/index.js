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

const calculatePosition = (aboveStory, bellowStory, storiesArray, index) => {
  if (bellowStory === undefined) {
    return (Number(storiesArray[index].position) + 1)
  }else if (aboveStory !== undefined && bellowStory !== undefined) {
    return (Number(bellowStory.position) + Number(aboveStory.position)) / 2;
  }else if (aboveStory === undefined) {
    return (Number(storiesArray[index].position) - 1);
  }
}

const getNewPosition = (item, story, storiesArray, index) => {
  let aboveStory;
  let bellowStory;

  if(item.index > index) {
    aboveStory = storiesArray[index - 1]
    bellowStory = story
  } else {
    bellowStory = storiesArray[index + 1]
    aboveStory = story
  }

  return calculatePosition(aboveStory, bellowStory, storiesArray, index)
}

const checkStoryPosition = (ref, dragIndex, hoverIndex, monitor) => {
  const hoverBoundingRect = ref.current.getBoundingClientRect()
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
  const clientOffset = monitor.getClientOffset()
  const hoverClientY = clientOffset.y - hoverBoundingRect.top
  
  if(dragIndex === hoverIndex) {
    return true
  }

  if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    return true
  }

  if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    return true
  }
}

const checkStory = (storySource, hoverIndex, newPosition, column) => {
  if (storySource.column !== column){
    return true
  };

  if (storySource.index === hoverIndex) {
    return true
  }
  
  if(storySource.position === newPosition) {
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
      if(!ref.current) {
        return true
      };
            
      if(story.state === 'accepted') {
        return true
      };
    
      const storySource = monitor.getItem();

      const hoverIndex = index

      let storiesArray = storySource.stories;

      let newPosition = getNewPosition(item, story, storiesArray, index);

      if (
        checkStory(storySource, hoverIndex, newPosition, column) ||
        checkStoryPosition(ref, storySource.index, hoverIndex, monitor)
      ) {
        return;
      }

      dragDropStory(storySource.id, storySource.projectId, {
        position: newPosition
      })
    }
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: type.story, ...story, index, stories, column},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag() {
      return story.state === "accepted" ? false : true
    },
    begin() {
      return { ...story, index, stories, column }
    },
    end(item, monitor) {
      const storySource = monitor.getDropResult()

      const {state, column} = storySource;

      if (
        (state === 'unscheduled' || state === 'unstarted') &&
        column !== 'done'
      ) {
        dragDropStory(item.id, item.projectId, {
          state: column === 'backlog' ? 'unstarted' : 'unscheduled'
        });
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
