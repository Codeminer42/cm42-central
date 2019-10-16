import * as ProjectBoard from 'models/beta/projectBoard';

describe('ProjectBoard model', () => {
  describe('hasSearch', () => {
    const validKeyWords = ['foo','bar','lorem ipsum'];
    const invalidKeyWords = ['', null, undefined, false];

    validKeyWords.forEach(keyWord => {
      describe(`when keyword is ${keyWord}`, () => {
        const projectBoard = {
          search: { keyWord }
        };

        it('returns truthy', () => {
          expect(ProjectBoard.hasSearch(projectBoard)).toBeTruthy();
        });
      });
    });

    invalidKeyWords.forEach(keyWord => {
      describe(`when keyword is ${keyWord}`, () => {
        const projectBoard = {
          search: { keyWord }
        };

        it('returns falsy', () => {
          expect(ProjectBoard.hasSearch(projectBoard)).toBeFalsy();
        });
      });
    });
  });

  describe('validSearch', () => {
    const validKeyWords = ['foo','bar','lorem ipsum'];
    const invalidKeyWords = ['', '   ', '']

    validKeyWords.forEach(keyWord => {
      describe(`when keyword is ${keyWord}`, () => {
        it('returns truthy', () => {
          expect(ProjectBoard.validSearch(keyWord)).toBeTruthy();
        });
      });
    });

    invalidKeyWords.forEach(keyWord => {
      describe(`when keyword is ${keyWord}`, () => {
        it('returns falsy', () => {
          expect(ProjectBoard.validSearch(keyWord)).toBeFalsy();
        });
      });
    });
  });
});