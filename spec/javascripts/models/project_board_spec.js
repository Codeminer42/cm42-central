var Cookies = require('js-cookie');

var Project = require('models/project');
var ProjectBoard = require('models/projectBoard');

describe('ProjectBoard model', function() {

  beforeEach(function() {
    Cookies.set('current_flow', 'progress_to_left', {expires: 365});

    this.project = new Project({
      id: 1337, title: 'Test project', point_values: [0, 1, 2, 3],
      last_changeset_id: null, iteration_start_day: 1, iteration_length: 1,
      default_flow: Cookies.get('current_flow'),
      current_flow: Cookies.get('current_flow')
    });

    this.projectBoard = new ProjectBoard({project: this.project});
  });

  describe('when instantiated', function() {

    it('should set up a story collection', function() {
      expect(this.projectBoard.stories).toBeDefined();
    });

    it('should have a project', function() {
      expect(this.projectBoard.project).toBe(this.project);
      expect(this.projectBoard.stories.project).toBe(this.project);
    });

    it("should have a default past iterations empty array", function() {
      expect(this.projectBoard.pastIterations).toEqual([]);
    });

  });

  describe('fetch', function() {

    it('should update the past iterations and stories of the project board', function(done) {
      var activeStories = [{story:{id:42,title:"Active story"}}];
      var pastIterations = [{start_date:"2018/03/19",end_date:"2018/03/25",points:3,iteration_number:2}];
      var dataHash = {active_stories: activeStories, past_iterations: pastIterations}
      var server = sinon.fakeServer.create();
      server.respondImmediately = true;
      server.respondWith(
        "GET", "/project_boards/1337", [
        200, {"Content-Type": "application/json"},
        JSON.stringify(dataHash)
        ]
      );

      var initialPastIterationsLength = this.projectBoard.pastIterations.length;

      var initialActiveStoriesLength = this.projectBoard.stories.length

      this.projectBoard.fetch()
        .then(() => {
          expect(this.projectBoard.pastIterations.length).toEqual(initialPastIterationsLength + 1);
          expect(this.projectBoard.stories.length).toEqual(initialActiveStoriesLength + 1);
          done();
        });
    });
  });

});
