import * as Sprint from 'models/beta/sprint';

describe('Sprint model', () => {
  const doneSprint = { hasStories: '' }
  const undoneSprint = {}

  describe('sort', () => {
    describe('when is done sprints', () => {
      const amountOfSprints = [1,10,100]

      amountOfSprints.forEach(amount => {
        describe(`when have ${amount} sprints`, () => {
          let doneSprints = Array(amount).fill(doneSprint);
          let changedSprints;

          beforeEach(() => {
            changedSprints = Sprint.sort(doneSprints);
          });

          it('return reverse order', () => {
            expect(changedSprints).toEqual(doneSprints.reverse());
          });
    
          it(`return ${doneSprints.length} sprints`, () => {
            expect(changedSprints.length).toEqual(doneSprints.length);
          });
        })
      })
    });

    describe('when is undone sprint', () => {
      const amountOfSprints = [1,10,100]

      amountOfSprints.forEach(amount => {
        describe(`when have ${amount} sprints`, () => {
          let undoneSprints = Array(amount).fill(undoneSprint);
          let changedSprints;
    
          beforeEach(() => {
            changedSprints = Sprint.sort(undoneSprints);
          });
    
          it('return the same order', () => {
            expect(changedSprints).toEqual(changedSprints)
          });
    
          it(`return ${undoneSprints.length} sprints`, () => {
            expect(changedSprints.length).toEqual(undoneSprints.length);
          });
        });
      });
    });
  });

  describe('isDone', () => {
    describe(`when has stories`, () => {
      it('return true', () => {
        expect(Sprint.isDone(doneSprint)).toBeTruthy();
      });

      it('return false', () => {
        expect(Sprint.isDone(undoneSprint)).toBeFalsy();
      });
    });
  });
});
