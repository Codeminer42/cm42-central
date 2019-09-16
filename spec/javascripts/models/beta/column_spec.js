import * as Column from 'models/beta/column.js';
import { status } from 'libs/beta/constants';

describe('Column model', function() {
  describe('isChillyBin', function() {
    it('should return true when state is unscheduled', function() {
      const story = { state: status.UNSCHEDULED }

      expect(Column.isChillyBin(story)).toEqual(true);
    });

    it('should return false when state is not unscheduled', function() {
      const story = { state: status.STARTED }

      expect(Column.isChillyBin(story)).toEqual(false);
    });
  })
})
