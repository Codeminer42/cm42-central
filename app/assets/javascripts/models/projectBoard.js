var StoryCollection = require('collections/story_collection');
var PastIteration = require('models/pastIteration')

class ProjectBoard {
  constructor({ project }) {
    this.project = project;
    this.stories = new StoryCollection();
    this.stories.project = project;
  }

  fetch() {
    return $.ajax(`/project_boards/${this.project.get('id')}`)
      .then((data) => {
        this.stories.reset(data.active_stories);
        this.pastIteration = data.past_iterations.map(past_iteration => new PastIteration({
          startDate: past_iteration.start_date,
          endDate: past_iteration.end_date,
          points: past_iteration.points,
          project: this.project
        }));
      });
  }
}
module.exports = ProjectBoard;
