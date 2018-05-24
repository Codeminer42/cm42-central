import moment from 'moment';

const ColumnAction = require('actions/column');

describe('ColumnAction', function() {
    
  describe("setColumn", function() {
    const current_sprint_date = moment();
    const previous_sprint_date = moment().subtract(1, 'weeks');
    
    const project = {    
      iterationLength: 1,
      iterationStartDay: 1,
      startDate : current_sprint_date.format()
    }
    
    const build_story_object = (state, acceptedAt) => {
      return {
        state: state,
        acceptedAt: acceptedAt,
        createdAt: project.startDate,        
        estimate : 1,
        id: 1,
        projectId: 1
      };
    }

    it("should return chilly bin if the story is unscheduled", function() {
     
      const story = build_story_object('unscheduled', null);

      const action = ColumnAction.getColumnType(story, project);
  
      expect(action.type).toEqual('COLUMN_CHILLY_BIN');
    });

    it("should return done if the story is accepted and belongs to previous sprint", function() {
      
      const story = build_story_object('accepted', previous_sprint_date.format());
      
      const action = ColumnAction.getColumnType(story, project);
  
      expect(action.type).toEqual('COLUMN_DONE');
    });

    it("should return backlog if the story is accepted and belongs to current sprint", function() {
      
      const story = build_story_object('accepted', project.startDate);
  
      const action = ColumnAction.getColumnType(story, project);
  
      expect(action.type).toEqual('COLUMN_BACKLOG');
    });

    it("should return backlog if the story is not accepted and belongs to current sprint", function() {
      
      const story = build_story_object(null, null);

      const action = ColumnAction.getColumnType(story, project);
  
      expect(action.type).toEqual('COLUMN_BACKLOG');
    });
  });

})

