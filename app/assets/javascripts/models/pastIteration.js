var StoryCollection = require('collections/story_collection');

var iterationNumber = 1;

class PastIteration {
  constructor({ startDate, endDate, points, project }) {
    this._startDate = new Date(startDate);
    this._endDate = new Date(endDate);
    this._points = points;
    this.project = project;
    this._stories = new StoryCollection();
    this.isLoaded = false;
    this.number = iterationNumber++;
    this.column = '#done';
  }

  fetch() {
    return $.ajax(`/project_boards/${this.project.get('id')}/iterations`, {
      data: { startDate: this.startDate, endDate: this.endDate }
    }).then((data) => {
       this._stories.reset(data.stories);
    });
  }

  stories() {
    return this._stories;
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

  get(attr) {
    return this[attr];
  }
}
module.exports = PastIteration;
