var StoryCollection = require('collections/story_collection');
var PastIteration = require('models/pastIteration')

class ProjectBoard {
  constructor({ project }) {
    this.project = project;
    this.stories = new StoryCollection();
    this.stories.project = project;
    this.pastIterations = [];
  }

  fetch() {
    return $.ajax(`/project_boards/${this.project.get('id')}`)
      .then((data) => {
        this.stories.reset(data.active_stories);
        this.pastIterations = data.past_iterations.map(past_iteration => new PastIteration({
          startDate: past_iteration.start_date,
          endDate: past_iteration.end_date,
          points: past_iteration.points,
          iterationNumber: past_iteration.iteration_number,
          project: this.project
        }));
      });
  }
}
module.exports = ProjectBoard;
