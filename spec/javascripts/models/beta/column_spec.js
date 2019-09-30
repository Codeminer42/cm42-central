import * as Column from 'models/beta/column.js';
import { states } from 'models/beta/story';
import { status } from 'libs/beta/constants';

describe('Column model', function() {
  describe('isChillyBin', function() {
    describe('when state is unscheduled', () => {
      it('returns truthy', function() {
        const story = { state: status.UNSCHEDULED }
  
        expect(Column.isChillyBin(story)).toBeTruthy();
      });
    });

    const noUnscheduledStates = states.filter(state => state !== status.UNSCHEDULED);
    
    noUnscheduledStates.forEach(state => {
      describe(`when state is ${state}`, () => {
        it('return falsy', () => {
          const story = { state }

          expect(Column.isChillyBin(story)).toBeFalsy(false);
        });
      });
    });
  })
})
