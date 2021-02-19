import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import * as Story from './story';
import * as Project from './project';
import { isNewStoryPosition } from './iteration';
import { operands, status } from './../../libs/beta/constants';
import { values, isEmpty } from 'underscore';
import { BACKLOG } from './column';

export const get = async (projectId) => {
  const { data } = await httpService
    .get(`/beta/project_boards/${projectId}`);

  return deserialize(data);
};

const deserialize = (data) => {
  const projectBoard = changeCase.camelKeys(data, {
    recursive: true,
    arrayRecursive: true
  });

  return {
    ...projectBoard,
    project: Project.deserialize(projectBoard),
    stories: projectBoard.stories.map(Story.deserialize)
  }
}

export const hasSearch = projectBoard => Boolean(projectBoard.search.keyWord);

export const validSearch = keyWord => Boolean(keyWord.trim());

export const isOperandSearch = word => {
  const operandsWords = Object.keys(operands);

  return containsInArray(word, operandsWords) && word.includes(':');
}

const containsInArray = (word, array) => array.some(operand => word.includes(operand))

export const canCloseColumn = projectBoard =>
  values(projectBoard.visibleColumns).filter(Boolean).length > 1;

const isOpen = (projectBoard, column) =>
  Boolean(projectBoard.visibleColumns[column])

export const translateOperand = word =>
  _.invert(I18n.translations[currentLocale()].story[word])

export const translateWord = (operand, word, translations) =>
  isFinite(word) || !haveTranslation(operand)
    ? word
    : I18n.t(`story.${operand}.${translations[word] || word}`, { locale: I18n.defaultLocale });

const translatedOperands = ['type', 'state'];

export const haveTranslation = operand => translatedOperands.includes(operand)

export const isEnglishLocale = () => currentLocale() === 'en';

const currentLocale = () => I18n.currentLocale();

export const toggleColumn = (projectBoard, column, callback) => {
  if (!isOpen(projectBoard, column) || canCloseColumn(projectBoard)) {
    return callback.onToggle();
  }
}

// Drag And drop utils
const calculatePositions = (aboveStory = {}, belowStory = {}, storyState = {}) => {
  const aboveStoryState = aboveStory.state;
  const belowStoryState = belowStory.state;
  const aboveStoryPosition = Number(aboveStory.position);
  const belowStoryPosition = Number(belowStory.position);
  const aboveStoryNewPosition = aboveStory.newPosition;
  const belowStoryNewPosition = belowStory.newPosition;

  const isFirstStory = !aboveStoryState;
  const isLastStory = !belowStoryState;
  const isLastStoryInSameState = aboveStoryState === storyState && belowStoryState !== storyState;
  const isFirstStoryInSameState = belowStoryState === storyState && aboveStoryState !== storyState;

  // return [position, newPosition]
  if (isFirstStory) return [belowStoryPosition - 1, 1];
  if (isFirstStoryInSameState) return [belowStoryPosition - 1, belowStoryNewPosition - 1];
  if (isLastStory || isLastStoryInSameState) return [aboveStoryPosition + 1, aboveStoryNewPosition + 1];

  return [(belowStoryPosition + aboveStoryPosition) / 2, aboveStoryNewPosition + 1];
}

export const getPositions = (
  destinationIndex,
  sourceIndex,
  storiesArray,
  isSameColumn,
  storyState,
) => {
  if (isEmpty(storiesArray)) {
    return [1, 1];
  }

  if (!isSameColumn || sourceIndex > destinationIndex) {
    return calculatePositions(storiesArray[destinationIndex - 1], storiesArray[destinationIndex], storyState);
  }

  return calculatePositions(storiesArray[destinationIndex], storiesArray[destinationIndex + 1], storyState);
};

// reorder the array
export const moveStory = (
  sourceArray,
  destinationArray,
  sourceIndex,
  destinationIndex,
  isSameColumn
) => {
  const removed = sourceArray[sourceIndex];

  const newDestinationArray = isSameColumn
    ? destinationArray.filter((_, index) => index !== sourceIndex)
    : [...destinationArray];

  newDestinationArray.splice(destinationIndex, 0, removed);

  return sortStories(newDestinationArray, destinationIndex);
};

export const sortStories = (destinationArray, destinationIndex) => {
  return destinationArray.map((item, index) => {
      if (index >= destinationIndex) {
        return { ...item, newPosition: item.newPosition + 1 }
      };
    return item;
  });
}

export const getNewSprints = (newStories, sprints, sprintIndex) =>
  sprints.map((sprint, index) =>
    index === sprintIndex ? { ...sprint, stories: newStories } : sprint,
  );

export const getNewState = (isSameColumn, dropColumn, currentState) => {
  if (isSameColumn) {
    return currentState;
  }
  return dropColumn === 'chillyBin' ? status.UNSCHEDULED : status.UNSTARTED;
}

export const getBacklogStories = (sprints, index) => isEmpty(sprints) ? [{ stories: [] }] : sprints[index].stories;

export const getSprintColumn = (column, backlogArray, chillyBinArray, sprintIndex) => {
  if (column === 'backlog') {
    if (backlogArray[sprintIndex]) {
      return backlogArray[sprintIndex].stories
    }
    return [];
  }
  return chillyBinArray;
}

export const dragStory = (source, destination, backlogSprints, callback) => {
  if (source && destination) {
    const destinationDroppableId = JSON.parse(destination.droppableId);
    const sourceDroppableId = JSON.parse(source.droppableId);

    if (destinationDroppableId.columnId === BACKLOG && sourceDroppableId.columnId === BACKLOG) {
      const destinationSprint = backlogSprints[destinationDroppableId.sprintIndex];
      const sourceSprint = backlogSprints[sourceDroppableId.sprintIndex];

      if (isNewStoryPosition(destinationSprint, destination.index)) return;

      const draggedStory = sourceSprint.stories[source.index];
      const destinationStory = destinationSprint.stories[destination.index];
      const isDropDisabled = !Story.isSameState(draggedStory, destinationStory);

      const updatedBacklogSprints = backlogSprints.map(item =>
        item.number === destinationSprint.number ? { ...item, isDropDisabled } : { ...item }
      );

      return callback(updatedBacklogSprints);
    }
  }
}
