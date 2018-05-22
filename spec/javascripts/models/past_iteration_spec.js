var Cookies = require('js-cookie');

var Project = require('models/project');
var PastIteration = require('models/pastIteration');

describe('PastIteration model', function() {

  beforeEach(function() {
    Cookies.set('current_flow', 'progress_to_left', {expires: 365});

    this.project = new Project({
      id: 1337, title: 'Test project', point_values: [0, 1, 2, 3],
      last_changeset_id: null, iteration_start_day: 1, iteration_length: 1,
      default_flow: Cookies.get('current_flow'),
      current_flow: Cookies.get('current_flow')
    });

    this.pastIterations = new PastIteration({
    	project: this.project,
    	startDate: Date.now(),
    	endDate: Date.now() + 7,
    	points: 3,
    	iterationNumber: 2
    });
  });

  describe('when instantiated', function() {

    it("should exhibit attributes", function() {
      expect(this.pastIterations.get('number')).toEqual(2);
    });

    it("should have a default load state", function() {
      expect(this.pastIterations.get('needsLoad')).toBe(true);
    });

    it("should have a default column", function() {
      expect(this.pastIterations.get('column')).toBe('#done');
    });
  });

  describe('stories', function() {

    it('should return the models stories', function() {
      expect(this.pastIterations.stories()).toEqual(this.pastIterations._stories);
    });

  });

  describe('startDate', function() {

    it('should return the models start date', function() {
      expect(this.pastIterations.startDate()).toEqual(this.pastIterations._startDate);
    });

  });

  describe('endDate', function() {

    it('should return the models end date', function() {
      expect(this.pastIterations.endDate()).toEqual(this.pastIterations._endDate);
    });

  });

  describe('points', function() {

    it('should return the model points', function() {
      expect(this.pastIterations.points()).toEqual(this.pastIterations._points);
    });

  });

  describe('fetch', function() {

    it('should update the stories from the iteration', function(done) {
      var story = [ { story:{id:42,title:"Test story"} } ];
      var stories = { stories:story }
      var server = sinon.fakeServer.create();

      server.respondImmediately = true;
      server.respondWith(
        "GET", /\/project_boards\/1337\/iterations(.*)/, [
        200, {"Content-Type": "application/json"},
        JSON.stringify(stories)
        ]
      );

      var initialStoriesLength = this.pastIterations._stories.length;

      this.pastIterations.fetch()
        .then(() => {
          expect(this.pastIterations._stories.length).toEqual(initialStoriesLength + 1);
          done();
        });
    });
  });

});
