import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import * as Story from './story';
import * as Project from './project';
import { operands } from './../../libs/beta/constants';

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

export const translateOperand = word =>
  _.invert(I18n.translations[currentLocale()].story[word])

export const translateWord = (operand, word, translations) =>
  isFinite(word) || !haveTranslation(operand)
    ? word
    : I18n.t(`story.${operand}.${translations[word] || word}`, { locale: I18n.defaultLocale });

const translatedOperands = ['type','state'];

export const haveTranslation = operand => translatedOperands.includes(operand)

export const isEnglishLocale = () => currentLocale() === 'en';

const currentLocale = () => I18n.currentLocale();
