import * as ProjectBoard from 'models/beta/search';
import { operands } from 'libs/beta/constants';

describe('Search model', () => {
  describe('serializeKeyWordSearch', () => {
    const words = ['foo','bar','lorem'];

    Object.keys(operands).forEach(operandKey => {
      words.forEach(word => {
        describe(`when keyword is ${operandKey}:${word}`, () => {
          it(`returns '${operands[operandKey]}:${word}'`, () => {
            const keyWord = `${operandKey}:${word}`;

            expect(ProjectBoard.serializeKeyWordSearch(keyWord)).toEqual(`${operands[operandKey]}:${word}`);
          });
        });

        describe(`when keyword is ${operandKey}${word}`, () => {
          it(`returns ${operandKey}${word}`, () => {
            const keyWord = `${operandKey}${word}`;

            expect(ProjectBoard.serializeKeyWordSearch(keyWord)).toEqual(keyWord);
          });
        });
      });
    });
  });
});
