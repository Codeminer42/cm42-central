import StoryCollection from '../collections/story_collection';
import PastIteration from '../models/pastIteration';

class ProjectBoard {
  constructor({ project }) {
    this.project = project;
    this.stories = new StoryCollection();
    this.stories.project = project;
    this.pastIterations = [];
  }

  fetch() {
    const that = this;
    return $.ajax(`/project_boards/${this.project.get('id')}`).then(data => {
      that.stories.reset(data.active_stories);
      that.pastIterations = data.past_iterations.map(
        past_iteration =>
          new PastIteration({
            startDate: past_iteration.start_date,
            endDate: past_iteration.end_date,
            points: past_iteration.points,
            iterationNumber: past_iteration.iteration_number,
            project: that.project,
          })
      );
    });
  }
}

export default ProjectBoard;
