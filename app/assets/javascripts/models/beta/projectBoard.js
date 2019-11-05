import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import * as Story from './story';
import * as Project from './project';
import { operands, status } from './../../libs/beta/constants';
import { values } from 'underscore';

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
  destinatitonIndex,
  sourceIndex,
  storiesArray,
  isSameColumn,
) => {
  if(storiesArray.length === 0){
    return 1; // if array is empty than set 1 to story position
  }

  if (!isSameColumn) {
    return calculatePosition(
      storiesArray[destinatitonIndex - 1],
      storiesArray[destinatitonIndex],
    );
  }
  if (sourceIndex > destinatitonIndex) {
    return calculatePosition(
      storiesArray[destinatitonIndex - 1],
      storiesArray[destinatitonIndex],
    );
  }
  return calculatePosition(
    storiesArray[destinatitonIndex],
    storiesArray[destinatitonIndex + 1],
  );
};

// reorder the array
export const moveTask = (
  sourceArray,
  destinationArray,
  sourceIndex,
  destinationIndex,
) => {
  const newSourceArray = sourceArray;
  const [removed] = newSourceArray.splice(sourceIndex, 1);
  const newDestinationArray = destinationArray;
  newDestinationArray.splice(destinationIndex, 0, removed);
  return [...newDestinationArray];
};

export const getNewSprints = (newStories, sprints, sprintIndex) =>
  sprints.map((sprint, index) =>
    index === sprintIndex ? { ...sprint, stories: newStories } : sprint,
  );

export const getNewState = (isSameColumn, dropColumn, currentState) => {
  if(isSameColumn) {
    return currentState;
  }
  return dropColumn === 'chillyBin' ? status.UNSCHEDULED : status.UNSTARTED;
}

export const getBacklogStories = (sprints, index) => sprints.length === 0 ? [{stories: []}] : sprints[index].stories;

export const getArray = (column, backlogArray, chillyBinArray, sprintIndex) => {
  if(column === 'backlog') {
    if(sprintIndex === undefined) {
      return;
    }  
    return backlogArray[sprintIndex].stories;
  }
  return chillyBinArray;
}
