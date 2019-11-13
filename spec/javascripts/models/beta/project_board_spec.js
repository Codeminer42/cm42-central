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


  describe('Drag and Drop', () => {
    describe('getNewPosition', () => {
      const array = [{ position: 24 }, { position: 20 }, { position: 16 }];

      describe('same column', () => {
        const isSameColumn = true;
        describe('Dragging from bottom to up', () => {
          const sourceIndex = 2;
          const destinationIndex = 1;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getNewPosition(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                '',
              ),
            ).toEqual(22);
          });
        });

        describe('Dragging from top to down', () => {
          const sourceIndex = 0;
          const destinationIndex = 1;
          it('return a new position', () => {
            expect(
              ProjectBoard.getNewPosition(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                '',
              ),
            ).toEqual(18);
          });
        });

        describe('Dragging to first index', () => {
          const sourceIndex = 2;
          const destinationIndex = 0;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getNewPosition(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                '',
              ),
            ).toEqual(23);
          });
        });

        describe('Dragging to last index', () => {
          const sourceIndex = 0;
          const destinationIndex = 2;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getNewPosition(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                '',
              ),
            ).toEqual(17);
          });
        });
      });

      describe("Differents columns", () => {
        const isSameColumn = false;
        describe("Dragging to another column", () => {
          const sourceIndex = 2;
          const destinationIndex = 1;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getNewPosition(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                '',
              ),
            ).toEqual(22);
          });
        });

        describe('Dragging to first index', () => {
          const sourceIndex = 2;
          const destinationIndex = 0;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getNewPosition(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                '',
              ),
            ).toEqual(23);
          });
        });

        describe('Dragging to last index', () => {
          const sourceIndex = 0;
          const destinationIndex = 3;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getNewPosition(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                '',
              ),
            ).toEqual(17);
          });
        });
      });
    });

    describe("moveTask", () => {
      let sourceArray;
      let destinationArray;
      let newDestArray;
      beforeEach(() => {
        newDestArray = [];
        sourceArray = [{story: 'source1'}, {story: 'source2'}, {story: 'source3'}];
        destinationArray = [{story: 'dest1'}, {story: 'dest2'}, {story: 'dest3'}];
      });

      describe("When moving in same column", () => {
        const sourceIndex = 0;
        const destinationIndex = 1;
        console.log(sourceArray)
        it('returns a new array', () => {
          newDestArray = ProjectBoard.moveTask(sourceArray, sourceArray, sourceIndex, destinationIndex);
          expect(newDestArray[1].story).toEqual('source1');
        });
      });
  
      describe('When moving to a different column', () => {
        const sourceIndex = 0;
        const destinationIndex = 1;
        it('returns a new array', () => {  
          newDestArray = ProjectBoard.moveTask(sourceArray, destinationArray, sourceIndex, destinationIndex);
          expect(newDestArray[1].story).toEqual('source1');
        });
      });
    });
  });
});
