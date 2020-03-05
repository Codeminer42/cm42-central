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
const calculatePosition = (aboveStory, bellowStory) => {
  if (bellowStory === undefined) return Number(aboveStory.position) + 1;
  if (aboveStory === undefined) return Number(bellowStory.position) - 1;
  return (Number(bellowStory.position) + Number(aboveStory.position)) / 2;
};

export const getNewPosition = (
  destinationIndex,
  sourceIndex,
  storiesArray,
  isSameColumn,
) => {
  if (isEmpty(storiesArray)) {
    return 1; // if array is empty than set 1 to story position
  }

  if (!isSameColumn || sourceIndex > destinationIndex) {
    return calculatePosition(
      storiesArray[destinationIndex - 1],
      storiesArray[destinationIndex],
    );
  }

  return calculatePosition(
    storiesArray[destinationIndex],
    storiesArray[destinationIndex + 1],
  );
};

// reorder the array
export const moveStory = (
  sourceArray,
  destinationArray,
  sourceIndex,
  destinationIndex,
) => {
  const newSourceArray = [...sourceArray];
  const [removed] = newSourceArray.splice(sourceIndex, 1);
  const newDestinationArray = [...destinationArray];
  const filteredArray = newDestinationArray.filter((el, index) => index !== sourceIndex);
  filteredArray.splice(destinationIndex, 0, removed);

  return [...filteredArray];
};

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
