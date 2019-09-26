import storyFactory from '../support/factories/storyFactory';
import { getColumns } from '../../../app/assets/javascripts/selectors/columns';
import * as Column from '../../../app/assets/javascripts/models/beta/column';
import moment from 'moment';

describe('Columns Selector', () => {
  const unscheduledStory = storyFactory({ id: 1, state: 'unscheduled', position: '1.0' });
  const unscheduledStory2 = storyFactory({ id: 2, state: 'unscheduled', position: '2.0' });
  const unstartedStory = storyFactory({ id: 3 });
  const startedStory = storyFactory({ id: 4, state: 'started' });
  const deliveredStory = storyFactory({ id: 5, state: 'delivered' });
  const acceptedStory = storyFactory({ id: 42,  state: 'accepted' });

  const currentSprintDate = moment();
  const previousSprintDate = moment().subtract(1, 'weeks');

  let storiesArray;

  beforeEach(() => {
    storiesArray = [unscheduledStory, unscheduledStory2, unstartedStory, startedStory, deliveredStory, acceptedStory];
  });

  describe('CHILLY_BIN', () => {
    it('return only unschedule stories', () => {
      const chillyBinStories = getColumns({
        column: Column.CHILLY_BIN,
        stories: storiesArray
      });

      expect(chillyBinStories).toContain(unscheduledStory);
      expect(chillyBinStories).not.toContain(unstartedStory);
      expect(chillyBinStories).not.toContain(startedStory);
      expect(chillyBinStories).not.toContain(deliveredStory);
      expect(chillyBinStories).not.toContain(acceptedStory);
    });

    it('return stories ordered by position', () => {
      const chillyBinStories = getColumns({
        column: Column.CHILLY_BIN,
        stories: storiesArray
      });

      expect(chillyBinStories).toEqual([unscheduledStory, unscheduledStory2]);
    });
  });

  describe('BACKLOG', () => {
    const storyAcceptedCurrentSprint = storyFactory({ state: 'accepted', acceptedAt: currentSprintDate });

    const project = {
      iterationLength: 1,
      iterationStartDay: 1,
      startDate: currentSprintDate.format("YYYY/MM/DD")
    };

    it('return story accepted in current sprint', () => {
      storiesArray.push(storyAcceptedCurrentSprint);

      const backlogSprints = getColumns({
        column: Column.BACKLOG,
        project,
        stories: storiesArray,
        pastIterations: []
      });

      expect(backlogSprints[0].stories).toContain(storyAcceptedCurrentSprint);
    });

    it('do not return unschedule stories', () => {
      const backlogSprints = getColumns({
        column: Column.BACKLOG,
        project,
        stories: storiesArray,
        pastIterations: []
      });

      expect(backlogSprints[0].stories).not.toContain(unscheduledStory);
    });
  });

  describe('DONE', () => {
    const pastIterations = [
      {
        iterationNumber: 420,
        startDate: previousSprintDate.format("YYYY/MM/DD"),
        endDate: currentSprintDate.format("YYYY/MM/DD"),
        storyIds: [42]
      }
    ];

    it('return pastIterations with start and end date', () => {
      const startDate =   moment(pastIterations[0].startDate).format("YYYY/MM/DD");
      const endDate = moment(pastIterations[0].endDate).format("YYYY/MM/DD");
      const doneSprints = getColumns({
        column: Column.DONE,
        pastIterations,
        stories: storiesArray
      });

      expect(doneSprints[0].startDate).toBe(startDate);
      expect(doneSprints[0].endDate).toBe(endDate);
    });

    it('returns past iteration stories', () => {
      const doneSprints = getColumns({
        column: Column.DONE,
        pastIterations,
        stories: storiesArray
      });

      expect(doneSprints[0].stories).toContain(acceptedStory);
      expect(doneSprints[0].stories).not.toContain(unscheduledStory);
      expect(doneSprints[0].stories).not.toContain(startedStory);
      expect(doneSprints[0].stories).not.toContain(deliveredStory);
      expect(doneSprints[0].stories).not.toContain(unstartedStory);
    });
  });
});
