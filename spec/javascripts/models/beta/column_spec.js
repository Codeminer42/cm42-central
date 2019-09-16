import * as Column from 'models/beta/column.js';

describe('Column model', function() {
  describe('isChillyBin', function() {
    it('should return true when state is unscheduled', function() {
      const story = { state: 'unscheduled' }

      expect(Column.isChillyBin(story)).toEqual(true);
    });

    it('should return false when state is not unscheduled', function() {
      const story = { state: 'started' }

      expect(Column.isChillyBin(story)).toEqual(false);
    });
  })
})
