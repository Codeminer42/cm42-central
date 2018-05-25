import moment from 'moment';

const ColumnAction = require('actions/column');

describe('ColumnAction', () => {
    
  describe("setColumn", () => {
    const currentSprintDate = moment();
    const previousSprintDate = moment().subtract(1, 'weeks');
    
    const project = {    
      iterationLength: 1,
      iterationStartDay: 1,
      startDate : currentSprintDate.format()
    }
    
    const buildStoryObject = (state, acceptedAt) => {
      return {
        state: state,
        acceptedAt: acceptedAt,
        createdAt: project.startDate,        
        estimate : 1,
        id: 1,
        projectId: 1
      };
    }

    it("return chilly bin if the story is unscheduled", () => {
     
      const story = buildStoryObject('unscheduled', null);

      const action = ColumnAction.getColumnType(story, project);
  
      expect(action.type).toEqual('COLUMN_CHILLY_BIN');
    });

    it("return done if the story is accepted and belongs to previous sprint", () => {
      
      const story = buildStoryObject('accepted', previousSprintDate.format());
      
      const action = ColumnAction.getColumnType(story, project);
  
      expect(action.type).toEqual('COLUMN_DONE');
    });

    it("return backlog if the story is accepted and belongs to current sprint", () => {
      
      const story = buildStoryObject('accepted', project.startDate);
  
      const action = ColumnAction.getColumnType(story, project);
  
      expect(action.type).toEqual('COLUMN_BACKLOG');
    });

    it("return backlog if the story is not accepted and belongs to current sprint", () => {
      
      const story = buildStoryObject(null, null);

      const action = ColumnAction.getColumnType(story, project);
  
      expect(action.type).toEqual('COLUMN_BACKLOG');
    });
  });

})

