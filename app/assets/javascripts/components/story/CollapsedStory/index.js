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
import { dragDropStory, updateCollapsedStory, highlight } from '../../../actions/story';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CollapsedStoryFocusButon from './CollapsedStoryFocusButton';
import { storyPropTypesShape } from './../../../models/beta/story';

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
  } else if (aboveStory === undefined) {
    return (Number(storiesArray[index].position) - 1);
  }
  return (Number(bellowStory.position) + Number(aboveStory.position)) / 2;
}

const getNewPosition = (item, story, storiesArray, index) => {
  if(item.index > index) {
    return calculatePosition(storiesArray[index - 1], story, storiesArray, index);
  }
  return calculatePosition(story, storiesArray[index + 1], storiesArray, index);
}

const isDraggedInTheSamePlaceOfHolder = (dragIndex, hoverIndex) => dragIndex === hoverIndex
const isDraggedBellowTheHover = (dragIndex, hoverIndex, hoverClientY, hoverMiddleY) => dragIndex < hoverIndex && hoverClientY < hoverMiddleY
const isDraggedAboveTheHover = (dragIndex, hoverIndex, hoverClientY, hoverMiddleY) => dragIndex > hoverIndex && hoverClientY > hoverMiddleY
const canContinue = (dragIndex, hoverIndex, hoverClientY, hoverMiddleY) =>
isDraggedBellowTheHover(dragIndex, hoverIndex, hoverClientY, hoverMiddleY) || isDraggedAboveTheHover(dragIndex, hoverIndex, hoverClientY, hoverMiddleY)

const checkStoryPosition = (ref, dragIndex, hoverIndex, monitor) => {
  const hoverBoundingRect = ref.current.getBoundingClientRect()
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
  const clientOffset = monitor.getClientOffset()
  const hoverClientY = clientOffset.y - hoverBoundingRect.top

  return isDraggedInTheSamePlaceOfHolder(dragIndex, hoverIndex)
    || canContinue(dragIndex, hoverIndex, hoverClientY, hoverMiddleY)
}

const canChangePosition = (ref, monitor, storySource, hoverIndex, newPosition) => {
  if(!ref.current) {
    return true
  }

  if(storySource.position === newPosition) {
    return true
  }

  if (storySource.index === hoverIndex) {
    return true
  }

  if(checkStoryPosition(ref, storySource.index, hoverIndex, monitor)) {
    return true
  }
}

const canChangeColumn = (state, column) =>
  (state === 'unscheduled' || state === 'unstarted') && column !== 'done';

const isADropTarget = (monitor) => !monitor.getDropResult()

export const CollapsedStory = ({
  onToggle,
  story,
  dragDropStory,
  project,
  className,
  title,
  index,
  stories,
  column,
  updateCollapsedStory,
  highlight,
  isHighlightable
}) => {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: type.story,
    canDrop() {
      return column !== 'done'
    },
    hover(item, monitor) {
      const storySource = monitor.getItem();
      const hoverIndex = index
      const storiesArray = storySource.stories;

      if (storySource.column !== column){
        return true
      };

      const newPosition = getNewPosition(item, story, storiesArray, index);

      if (canChangePosition(ref, monitor, storySource, hoverIndex, newPosition)) {
        return true;
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
      if(isADropTarget(monitor)) return null;
      const {state, column} = monitor.getDropResult();

      if (canChangeColumn(state, column) && !Story.isUnestimatedFeature(story)) {
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
