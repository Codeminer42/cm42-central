import * as ProjectBoard from './projectBoard';
import * as Story from './story';
import { operands } from './../../libs/beta/constants';

export const searchStories = async (keyWord, projectId, callback) => {
  if (ProjectBoard.validSearch(keyWord)) {
    callback.onStart();

    try {
      const queryParam = serializeKeyWordSearch(keyWord);
      const result = await Story.search(queryParam, projectId);

      return callback.onSuccess(result);
    } catch (error) {
      return callback.onError(error);
    }
  }
}

export const serializeKeyWordSearch = keyWord => {
  if (ProjectBoard.isOperandSearch(keyWord)) {
    const [firstKeyWord, secondKeyWord] = keyWord.split(':');

    if (!ProjectBoard.isEnglishLocale()) {
      const translations = ProjectBoard.translateOperand(firstKeyWord);
      const translatedWord = ProjectBoard.translateWord(firstKeyWord, secondKeyWord, translations) || secondKeyWord;

      return `${operands[firstKeyWord] || firstKeyWord}:${translatedWord}`;
    }

    return `${operands[firstKeyWord] || firstKeyWord}:${secondKeyWord}`;
  }

  return keyWord;
}
