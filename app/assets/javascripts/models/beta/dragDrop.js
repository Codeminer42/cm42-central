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
