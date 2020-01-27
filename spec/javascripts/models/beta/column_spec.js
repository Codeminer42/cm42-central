import * as Column from 'models/beta/column.js';
import { states } from 'models/beta/story';
import { status } from 'libs/beta/constants';

describe('Column model', function() {
  describe('isChillyBin', function() {
    const noUnscheduledStates = states.filter(state => state !== status.UNSCHEDULED);
    
    describe('when state is unscheduled', () => {
      it('returns truthy', function() {
        const story = { state: status.UNSCHEDULED }
  
        expect(Column.isChillyBin(story)).toBeTruthy();
      });
    });
    
    noUnscheduledStates.forEach(state => {
      describe(`when state is ${state}`, () => {
        it('return falsy', () => {
          const story = { state }

          expect(Column.isChillyBin(story)).toBeFalsy();
        });
      });
    });
  });

  describe('sort', () => {
    const columns = [
      {
        title: 'Column #1',
        visible: true,
      },
      {
        title: 'Column #2',
        visible: true,
      }
    ];

    describe('when reverse is false', () => {
      it('returns columns in same order', () => {
        const reverse = false;

        expect(Column.sort(columns, reverse)).toStrictEqual([
          {
            title: 'Column #1',
            visible: true,
          },
          {
            title: 'Column #2',
            visible: true,
          }
        ]);
      });
    });
  
    describe('when reverse is true', () => {
      it('returns columns reversed', () => {
        const reverse = true;

        expect(Column.sort(columns, reverse)).toStrictEqual([
          {
            title: 'Column #2',
            visible: true,
          },
          {
            title: 'Column #1',
            visible: true,
          }
        ]);
      });
    });
  });
})
