var StoryCollection = require('collections/story_collection');

class PastIteration {
  constructor({ startDate, endDate, points, project }) {
    this._startDate = startDate;
    this._endDate = endDate;
    this._points = points;
    this.project = project;
    this.stories = new StoryCollection();
    this.isLoaded = false;
  }

  fetch() {
    return $.ajax(`/project_boards/${this.project.get('id')}/iterations`, {
      data: { startDate: this.startDate, endDate: this.endDate }
    }).then((data) => {
       this.stories.reset(data.stories);
    });
  }

  startDate() {
    return this._startDate;
  }

  endDate() {
    return this._endDate;
  }

  points() {
    return this._points;
  }
}
module.exports = PastIteration;
