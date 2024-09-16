import * as ProjectBoard from 'models/beta/projectBoard';
import { operands } from 'libs/beta/constants';

describe('ProjectBoard model', () => {
  describe('hasSearch', () => {
    const validKeyWords = ['foo', 'bar', 'lorem ipsum'];
    const invalidKeyWords = ['', null, undefined, false];

    validKeyWords.forEach(keyWord => {
      describe(`when keyword is ${keyWord}`, () => {
        const projectBoard = {
          search: { keyWord },
        };

        it('returns truthy', () => {
          expect(ProjectBoard.hasSearch(projectBoard)).toBeTruthy();
        });
      });
    });

    invalidKeyWords.forEach(keyWord => {
      describe(`when keyword is ${keyWord}`, () => {
        const projectBoard = {
          search: { keyWord },
        };

        it('returns falsy', () => {
          expect(ProjectBoard.hasSearch(projectBoard)).toBeFalsy();
        });
      });
    });
  });

  describe('validSearch', () => {
    const validKeyWords = ['foo', 'bar', 'lorem ipsum'];
    const invalidKeyWords = ['', '   ', ''];

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
    const words = ['foo', 'bar', 'lorem'];

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
    const translatedOperands = ['type', 'state'];
    const noTranslatedOperands = ['foo', 'bar', 'lorem', 'ipsum'];

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
        onToggle = vi.fn();
        callback = { onToggle };
      });

      describe('and have more of one column open', () => {
        it('calls callback.onToggle', () => {
          const projectBoard = {
            visibleColumns: {
              chillyBin: true,
              backlog: true,
            },
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
              backlog: false,
            },
          };

          ProjectBoard.toggleColumn(projectBoard, column, callback);
          expect(onToggle.called).toBeFalsy();
        });
      });
    });

    describe('when is opening an column', () => {
      const projectBoard = {
        visibleColumns: {
          chillyBin: false,
        },
      };
      const column = 'chillyBin';
      let onToggle;
      let callback;

      beforeEach(() => {
        onToggle = vi.fn();
        callback = { onToggle };
      });

      it('always calls callback.onToggle', () => {
        ProjectBoard.toggleColumn(projectBoard, column, callback);

        expect(callback.onToggle).toHaveBeenCalled();
      });
    });
  });

  describe('Drag and Drop', () => {
    describe('getPositions', () => {
      const array = [
        { newPosition: 24, position: 24, state: 'finished' },
        { newPosition: 20, position: 20, state: 'finished' },
        { newPosition: 16, position: 16, state: 'unstarted' },
        { newPosition: 12, position: 12, state: 'unstarted' },
        { newPosition: 8, position: 8, state: 'started' },
        { newPosition: 4, position: 4, state: 'started' },
      ];

      describe('same column', () => {
        const isSameColumn = true;
        describe('Dragging from bottom to up', () => {
          const sourceIndex = 3;
          const destinationIndex = 2;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getPositions(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                'unstarted'
              )
            ).toEqual([15, 15]);
          });
        });

        describe('Dragging from top to down', () => {
          const sourceIndex = 0;
          const destinationIndex = 1;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getPositions(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                'finished'
              )
            ).toEqual([21, 21]);
          });
        });

        describe('Dragging to first index', () => {
          const sourceIndex = 1;
          const destinationIndex = 0;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getPositions(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                'finished'
              )
            ).toEqual([23, 1]);
          });
        });

        describe('Dragging to last index', () => {
          const sourceIndex = 4;
          const destinationIndex = 5;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getPositions(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                'started'
              )
            ).toEqual([5, 5]);
          });
        });
      });

      describe('Different columns', () => {
        const isSameColumn = false;
        describe('Dragging to another column', () => {
          const sourceIndex = 3;
          const destinationIndex = 2;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getPositions(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                'unstarted'
              )
            ).toEqual([15, 15]);
          });
        });

        describe('Dragging to first index', () => {
          const sourceIndex = 1;
          const destinationIndex = 0;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getPositions(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                'finished'
              )
            ).toEqual([23, 1]);
          });
        });

        describe('Dragging to last index', () => {
          const sourceIndex = 4;
          const destinationIndex = 6;
          it('returns a new position', () => {
            expect(
              ProjectBoard.getPositions(
                destinationIndex,
                sourceIndex,
                array,
                isSameColumn,
                'started'
              )
            ).toEqual([5, 5]);
          });
        });
      });
    });

    describe('moveStory', () => {
      let sourceArray;
      let destinationArray;
      let newDestArray;
      beforeEach(() => {
        newDestArray = [];
        sourceArray = [
          { story: 'source1' },
          { story: 'source2' },
          { story: 'source3' },
        ];
        destinationArray = [
          { story: 'dest1' },
          { story: 'dest2' },
          { story: 'dest3' },
        ];
      });

      describe('When moving in same column', () => {
        const sourceIndex = 0;
        const destinationIndex = 1;
        it('returns a new array', () => {
          newDestArray = ProjectBoard.moveStory(
            sourceArray,
            sourceArray,
            sourceIndex,
            destinationIndex
          );
          expect(newDestArray[1].story).toEqual('source1');
        });
      });

      describe('When moving to a different column', () => {
        const sourceIndex = 0;
        const destinationIndex = 1;
        it('returns a new array', () => {
          newDestArray = ProjectBoard.moveStory(
            sourceArray,
            destinationArray,
            sourceIndex,
            destinationIndex
          );
          expect(newDestArray[1].story).toEqual('source1');
        });
      });
    });
  });
});
