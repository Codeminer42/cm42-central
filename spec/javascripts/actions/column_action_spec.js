import moment from 'moment';
import * as ColumnAction from 'actions/column';

describe('ColumnAction', () => {

  describe("setColumn", () => {
    const currentSprintDate = moment();
    const previousSprintDate = moment().subtract(1, 'weeks');

    const project = {
      iterationLength: 1,
      iterationStartDay: 1,
      startDate : currentSprintDate.format()
    };

    const buildStoryObject = (config = {}) => {
      return {
        state: config.state,
        acceptedAt: config.acceptedAt,
        createdAt: project.startDate,
        estimate : 1,
        id: 1,
        projectId: 1
      };
    };

    it("return chilly bin if the story is unscheduled", () => {

      const story = buildStoryObject({
        state: 'unscheduled'
      });

      const action = ColumnAction.getColumnType(story, project);

      expect(action.type).toEqual('COLUMN_CHILLY_BIN');
    });

    it("return done if the story is accepted and belongs to previous sprint", () => {

      const story = buildStoryObject({
        state: 'accepted',
        acceptedAt: previousSprintDate.format()
      });

      const action = ColumnAction.getColumnType(story, project);

      expect(action.type).toEqual('COLUMN_DONE');
    });

    it("return backlog if the story is accepted and belongs to current sprint", () => {

      const story = buildStoryObject({
        state: 'accepted',
        acceptedAt: project.startDate
      });

      const action = ColumnAction.getColumnType(story, project);

      expect(action.type).toEqual('COLUMN_BACKLOG');
    });

    it("return backlog if the story is not accepted and belongs to current sprint", () => {

      const story = buildStoryObject();

      const action = ColumnAction.getColumnType(story, project);

      expect(action.type).toEqual('COLUMN_BACKLOG');
    });
  });

})

