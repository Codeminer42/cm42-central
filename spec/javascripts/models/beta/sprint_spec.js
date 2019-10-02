import * as Sprint from 'models/beta/sprint';

describe('Sprint model', () => {
  const doneSprint = { hasStories: '' }
  const undoneSprint = {}

  describe('sortSprints', () => {
    describe('when all sprints are done', () => {
      const sprints = [
        { id: 1, hasStories: '' },
        { id: 2, hasStories: '' },
        { id: 3, hasStories: '' },
      ];
  
      it('returns the sprints list reversed', () => {
        expect(Sprint.sortSprints(sprints)).toEqual([
          { id: 3, hasStories: '' },
          { id: 2, hasStories: '' },
          { id: 1, hasStories: '' },
        ])
      });
    });
  
    describe('When not all sprints are done', () => {
      const sprints = [
        { id: 1, hasStories: '' },
        { id: 2, hasStories: '' },
        { id: 3 },
      ];
  
      it('returns the sprints list', () => {
        expect(Sprint.sortSprints(sprints)).toEqual([
          { id: 1, hasStories: '' },
          { id: 2, hasStories: '' },
          { id: 3 },
        ])
      });
    });
  
    describe('When none sprints are done', () => {
      const sprints = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ];
  
      it('returns the sprints list', () => {
        expect(Sprint.sortSprints(sprints)).toEqual([
          { id: 1 },
          { id: 2 },
          { id: 3 },
        ])
      });
    });
  });

  describe('isDone', () => {
    describe(`when story is done`, () => {
      it('returns truthy', () => {
        expect(Sprint.isDone(doneSprint)).toBeTruthy();
      });

      it('returns falsy', () => {
        expect(Sprint.isDone(undoneSprint)).toBeFalsy();
      });
    });
  });
});
