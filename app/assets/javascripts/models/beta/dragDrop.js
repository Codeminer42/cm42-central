import { useDrag, useDrop } from 'react-dnd';
import { useRef } from 'react';
import { isNotDone } from './column';
import * as Story from './story';

export const type = {
  story: 'STORY'
}

export const calculatePosition = (aboveStory, bellowStory, storiesArray, index) => {
  if (bellowStory === undefined) {
    return (Number(storiesArray[index].position) + 1);
  } else if (aboveStory === undefined) {
    return (Number(storiesArray[index].position) - 1);
  }
  return (Number(bellowStory.position) + Number(aboveStory.position)) / 2;
}

export const getNewPosition = (item, story, storiesArray, index) => {
  if(item.index > index) {
    return calculatePosition(storiesArray[index - 1], story, storiesArray, index);
  }
  return calculatePosition(story, storiesArray[index + 1], storiesArray, index);
}

export const isDraggedInTheSamePlaceOfHolder = (dragIndex, hoverIndex) => dragIndex === hoverIndex
export const isDraggedBellowTheHover = (dragIndex, hoverIndex, hoverClientY, hoverMiddleY) => dragIndex < hoverIndex && hoverClientY < hoverMiddleY
export const isDraggedAboveTheHover = (dragIndex, hoverIndex, hoverClientY, hoverMiddleY) => dragIndex > hoverIndex && hoverClientY > hoverMiddleY
export const canContinue = (dragIndex, hoverIndex, hoverClientY, hoverMiddleY) =>
isDraggedBellowTheHover(dragIndex, hoverIndex, hoverClientY, hoverMiddleY) || isDraggedAboveTheHover(dragIndex, hoverIndex, hoverClientY, hoverMiddleY)

export const checkStoryPosition = (ref, dragIndex, hoverIndex, monitor) => {
  const hoverBoundingRect = ref.current.getBoundingClientRect()
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
  const clientOffset = monitor.getClientOffset()
  const hoverClientY = clientOffset.y - hoverBoundingRect.top

  return isDraggedInTheSamePlaceOfHolder(dragIndex, hoverIndex)
    || canContinue(dragIndex, hoverIndex, hoverClientY, hoverMiddleY)
}

export const canChangePosition = (ref, monitor, storySource, hoverIndex, newPosition) =>
  !ref.current ||
    storySource.position === newPosition ||
    storySource.index === hoverIndex ||
    checkStoryPosition(ref, storySource.index, hoverIndex, monitor)

export const canChangeColumn = (state, column) =>
  (state === 'unscheduled' || state === 'unstarted') && column !== 'done';

export const isADropTarget = (monitor) => !monitor.getDropResult()

export const DragDropRefs = (dragDropStory, index, stories, column, story) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: type.story,
    canDrop() {
      return isNotDone(column);
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

      dragDropStory(storySource.id, {
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
      return story.state !== "accepted";
    },
    begin() {
      return { ...story, index, stories, column }
    },
    end(item, monitor) {
      if(isADropTarget(monitor)) return null;
      const {state, column} = monitor.getDropResult();

      if (canChangeColumn(state, column) && !Story.isUnestimatedFeature(story)) {
        dragDropStory(item.id, {
          state: column === 'backlog' ? 'unstarted' : 'unscheduled'
        });
      }
    }
  })

  return [drag(drop(ref)), isDragging];
}
