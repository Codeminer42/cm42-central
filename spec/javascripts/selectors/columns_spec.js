import storyFactory from "../support/factories/storyFactory";
import { getColumns } from "../../../app/assets/javascripts/selectors/columns";
import * as Column from "../../../app/assets/javascripts/models/beta/column";
import moment from "moment";

describe("Columns Selector", () => {
  const unscheduledStory = storyFactory({
    id: 1,
    state: "unscheduled",
    position: "1.0",
  });
  const unscheduledStory2 = storyFactory({
    id: 2,
    state: "unscheduled",
    position: "2.0",
  });
  const unstartedStory = storyFactory({ id: 3 });
  const startedStory = storyFactory({ id: 4, state: "started" });
  const deliveredStory = storyFactory({ id: 5, state: "delivered" });
  const acceptedStory = storyFactory({ id: 42, state: "accepted" });

  const currentSprintDate = moment();
  const previousSprintDate = moment().subtract(1, "weeks");

  let stories;

  beforeEach(() => {
    stories = {
      all: {
        stories: {
          byId: {
            1: unscheduledStory,
            2: unscheduledStory2,
            3: unstartedStory,
            4: startedStory,
            5: deliveredStory,
            42: acceptedStory,
          },
          allIds: [1, 2, 3, 4, 5, 42],
        },
      },
      epic: {},
      search: {},
    };
  });

  describe("CHILLY_BIN", () => {
    it("return only unschedule stories", () => {
      const chillyBinStories = getColumns({
        column: Column.CHILLY_BIN,
        stories,
      });

      expect(chillyBinStories).toContain(unscheduledStory);
      expect(chillyBinStories).not.toContain(unstartedStory);
      expect(chillyBinStories).not.toContain(startedStory);
      expect(chillyBinStories).not.toContain(deliveredStory);
      expect(chillyBinStories).not.toContain(acceptedStory);
    });

    it("return stories ordered by position", () => {
      const chillyBinStories = getColumns({
        column: Column.CHILLY_BIN,
        stories,
      });

      expect(chillyBinStories).toEqual([unscheduledStory, unscheduledStory2]);
    });
  });

  describe("BACKLOG", () => {
    const storyAcceptedCurrentSprint = storyFactory({
      state: "accepted",
      acceptedAt: currentSprintDate,
    });

    const project = {
      iterationLength: 1,
      iterationStartDay: 1,
      startDate: currentSprintDate.format("YYYY/MM/DD"),
    };

    it("return story accepted in current sprint", () => {
      const newStoryId = storyAcceptedCurrentSprint.id;
      stories.all.stories.byId[newStoryId] = storyAcceptedCurrentSprint;

      const backlogSprints = getColumns({
        column: Column.BACKLOG,
        project,
        stories,
        pastIterations: [],
      });

      expect(backlogSprints[0].stories).toContain(storyAcceptedCurrentSprint);
    });

    it("do not return unschedule stories", () => {
      const backlogSprints = getColumns({
        column: Column.BACKLOG,
        project,
        stories,
        pastIterations: [],
      });

      expect(backlogSprints[0].stories).not.toContain(unscheduledStory);
    });
  });

  describe("DONE", () => {
    const pastIterations = {
      pastIterations: {
        byId: {
          420: {
            iterationNumber: 420,
            startDate: previousSprintDate.format("YYYY/MM/DD"),
            endDate: currentSprintDate.format("YYYY/MM/DD"),
            storyIds: [42],
          },
        },
        allIds: [420],
      },
    };
    it("return pastIterations with start and end date", () => {
      const startDate = pastIterations.pastIterations.byId[420].startDate;
      const endDate = pastIterations.pastIterations.byId[420].endDate;
      const doneSprints = getColumns({
        column: Column.DONE,
        pastIterations,
        stories,
      });

      expect(doneSprints[0].startDate).toBe(startDate);
      expect(doneSprints[0].endDate).toBe(endDate);
    });

    it("returns past iteration stories", () => {
      const doneSprints = getColumns({
        column: Column.DONE,
        pastIterations,
        stories,
      });

      expect(doneSprints[0].stories).toContain(acceptedStory);
      expect(doneSprints[0].stories).not.toContain(unscheduledStory);
      expect(doneSprints[0].stories).not.toContain(startedStory);
      expect(doneSprints[0].stories).not.toContain(deliveredStory);
      expect(doneSprints[0].stories).not.toContain(unstartedStory);
    });
  });
});
