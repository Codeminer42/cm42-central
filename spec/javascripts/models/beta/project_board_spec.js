import * as ProjectBoard from 'models/beta/projectBoard';
import { operands } from 'libs/beta/constants';

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

  describe('isOperandSearch', () => {
    const words = ['foo','bar','lorem'];

    Object.keys(operands).forEach(operandKey => {
      words.forEach(word => {
        describe("when search keyword has ':'", () => {
          describe(`and includes '${operandKey}'`, () => {
            it('returns truphy', () => {
              const keyWord = `${operandKey}:${word}`;

              expect(ProjectBoard.isOperandSearch(keyWord)).toBeTruthy();
            });
          });
        });

        describe("when search keyword has not ':'", () => {
          describe(`and includes '${operandKey}'`, () => {
            it('returns falsy', () => {
              const keyWord = `${operandKey}${word}`;

              expect(ProjectBoard.isOperandSearch(operandKey)).toBeFalsy();
            });
          });
        });
      });
    });
  });

  describe('haveTranslation', () => {
    const translatedOperands = ['type','state'];
    const noTranslatedOperands = ['foo','bar','lorem','ipsum'];

    translatedOperands.forEach(operand => {
      describe(`when operand is ${operand}`, () => {
        it('returns truphy', () => {
          expect(ProjectBoard.haveTranslation(operand)).toBeTruthy();
        });
      });
    });

    noTranslatedOperands.forEach(operand => {
      describe(`when operand is ${operand}`, () => {
        it('returns falsy', () => {
          expect(ProjectBoard.haveTranslation(operand)).toBeFalsy();
        });
      });
    });
  });

  describe('toggleColumn', () => {
    describe('when is closing a column', () => {
      const column = 'chillyBin';
      let onToggle;
      let callback;

      beforeEach(() => {
        onToggle = sinon.spy();
        callback = { onToggle }
      });

      describe('and have more of one column open', () => {
        it('calls callback.onToggle', () => {
          const projectBoard = {
            visibleColumns: {
              chillyBin: true,
              backlog: true
            }
          };
  
          ProjectBoard.toggleColumn(projectBoard, column, callback);
          expect(onToggle.called).toBeTruthy();
        });
      });

      describe('and have just on column open', () => {
        it('does not call callback.onToggle', () => {
          const projectBoard = {
            visibleColumns: {
              chillyBin: true,
              backlog: false
            }
          };
  
          ProjectBoard.toggleColumn(projectBoard, column, callback);
          expect(onToggle.called).toBeFalsy();
        });
      });
    });

    describe('when is opening an column', () => {
      const projectBoard = {
        visibleColumns: {
          chillyBin: false
        }
      };
      const column = 'chillyBin';
      let onToggle;
      let callback;

      beforeEach(() => {
        onToggle = sinon.spy();
        callback = { onToggle };
      });

      it('always calls callback.onToggle', () => {
        ProjectBoard.toggleColumn(projectBoard, column, callback);

        expect(onToggle.called).toBeTruthy();
      });
    });
  });
});
