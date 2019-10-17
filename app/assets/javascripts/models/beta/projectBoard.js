import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import * as Story from './story';
import * as Project from './project';
import PropTypes from 'prop-types';
import { operands } from './../../libs/beta/constants';

export const get = async (projectId) => {
  const { data } = await httpService
    .get(`/beta/project_boards/${projectId}`);

  return deserialize(data);
};

export const projectBoardPropTypesShape = PropTypes.shape({
  error: PropTypes.oneOf([
    PropTypes.object,
    PropTypes.array
  ]),
  isFetched: PropTypes.bool.isRequired
});

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

  return operandsWords.some(operand => word.includes(operand)) && word.includes(':');
}

export const serializeKeyWordSearch = keyWord => {
  if (isOperandSearch(keyWord)) {
    const arraySearch = keyWord.split(':');
    return `${operands[arraySearch[0]] || arraySearch[0]}:${arraySearch[1]}`;
    const [firstKeyWord, secondKeyWord] = keyWord.split(':');

    if (!isEnglishLocale()) {
      const translations = _.invert(I18n.translations[currentLocale()].story[firstKeyWord]);
      const translatedWord = I18n.t(`story.${firstKeyWord}.${translations[secondKeyWord]}`, { locale: I18n.defaultLocale });
      return `${operands[firstKeyWord] || translatedWord}:${translatedWord}`;
    } else {
      return `${operands[firstKeyWord] || secondKeyWord}:${secondKeyWord}`;
    }

  }

  return keyWord;
}

const isEnglishLocale = () => I18n.currentLocale() === 'en';

const currentLocale = () => I18n.currentLocale();
