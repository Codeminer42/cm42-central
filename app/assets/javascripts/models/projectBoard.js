var StoryCollection = require('collections/story_collection');

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
      });
  }
}
module.exports = ProjectBoard;
