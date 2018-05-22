var Story = require('models/story');

class PastIteration {
  constructor({ startDate, endDate, points, iterationNumber, project }) {
    this._startDate = new Date(startDate);
    this._endDate = new Date(endDate);
    this._points = points;
    this.number = iterationNumber;
    this._stories = [];
    this._stories.project = project;
    this.project = project;
    this.needsLoad = true;
    this.column = '#done';
  }

  fetch() {
    if(this.needsLoad) {
      this.needsLoad = false;
    }

    const that = this;
    return $.ajax(`/project_boards/${this.project.get('id')}/iterations`, {
      data: { start_date: this._startDate.toISOString(), end_date: this._endDate.toISOString() }
    }).then((data) => {
      that._stories = data.stories.map((attrs) => new Story(attrs, {
        collection: that.project.projectBoard.stories
      }));
      that.project.projectBoard.stories.add(that._stories);
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
