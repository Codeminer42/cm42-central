import storyFactory from '../support/factories/storyFactory';
import { getColumns } from '../../../app/assets/javascripts/selectors/columns';
import * as Column from '../../../app/assets/javascripts/models/beta/column';
import moment from 'moment';

describe('Columns Selector', () => {
  const unscheduledStory = storyFactory({ state: 'unscheduled' });
  const startedStory = storyFactory({ state: 'started' });
  const deliveredStory = storyFactory({ state: 'delivered' });

  const currentSprintDate = moment();
  const previousSprintDate = moment().subtract(1, 'weeks');

  let storiesArray; 
  
  beforeEach(() => {
    storiesArray = [unscheduledStory, startedStory, deliveredStory];
  });

  describe('CHILLY_BIN', () => {
    it('return only unschedule stories', () => {
      const chillyBinStories = getColumns({
        column: Column.CHILLY_BIN,
        stories: storiesArray
      });

      expect(chillyBinStories).toContain(unscheduledStory);
      expect(chillyBinStories).not.toContain(startedStory);
      expect(chillyBinStories).not.toContain(deliveredStory);
    });
  });

  describe('BACKLOG', () => {
    const storyAcceptedCurrentSprint = storyFactory({ state: 'accepted', acceptedAt: currentSprintDate });

    const project = {
      iterationLength: 1,
      iterationStartDay: 1,
      startDate: currentSprintDate.format()
    };

    it('return story accepted in current sprint', () => {
      storiesArray.push(storyAcceptedCurrentSprint);

      const backlogSprints = getColumns({
        column: Column.BACKLOG,
        project,
        stories: storiesArray
      });

      expect(backlogSprints[0].stories).toContain(storyAcceptedCurrentSprint);
    });

    it('do not return unschedule stories', () => {
      const backlogSprints = getColumns({
        column: Column.BACKLOG,
        project,
        stories: storiesArray
      });

      expect(backlogSprints[0].stories).not.toContain(unscheduledStory);
    });
  });

  describe('DONE', () => {
    const pastIterations = [
      {
        startDate: previousSprintDate,
        endDate: currentSprintDate
      }
    ];

    it('return pastIterations with start and end date', () => {
      const startDate =   moment(pastIterations[0].startDate).format("ddd MMM Do Y");
      const endDate = moment(pastIterations[0].endDate).format("ddd MMM Do Y");

      const doneSprints = getColumns({
        column: Column.DONE,
        pastIterations
      });

      expect(doneSprints[0].startDate).toBe(startDate);
      expect(doneSprints[0].endDate).toBe(endDate);
    });
  });
});
