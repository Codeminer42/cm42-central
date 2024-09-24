import Iteration from 'models/iteration';

describe('iteration', function () {
  let iteration;

  beforeEach(function () {
    iteration = new Iteration({});
  });

  describe('initialize', function () {
    it('should assign stories if passed', function () {
      var stories = [1, 2, 3];
      var iteration = new Iteration({ stories: stories });
      expect(iteration.get('stories')).toEqual(stories);
    });
  });

  describe('defaults', function () {
    it('should have an empty array of stories', function () {
      expect(iteration.get('stories')).toEqual([]);
    });
  });

  describe('points', function () {
    let stories;

    beforeEach(function () {
      var Story = Backbone.Model.extend({ name: 'story' });
      stories = [
        new Story({ estimate: 2, story_type: 'feature' }),
        new Story({ estimate: 3, story_type: 'feature', state: 'accepted' }),
        new Story({ estimate: 3, story_type: 'bug', state: 'accepted' }), // Only features count
        // towards velocity
      ];
      iteration.set({ stories: stories });
    });

    it('should calculate its points', function () {
      expect(iteration.points()).toEqual(5);
    });

    it('should return 0 for points if it has no stories', function () {
      iteration.unset('stories');
      expect(iteration.points()).toEqual(0);
    });

    it('should report how many points it overflows by', function () {
      // Should return 0
      iteration.set({ maximum_points: 2 });
      var pointsStub = vi.spyOn(iteration, 'points');

      // Should return 0 if the iteration points are less than maximum_points
      pointsStub.mockReturnValueOnce(1);
      expect(iteration.overflowsBy()).toEqual(0);

      // Should return 0 if the iteration points are equal to maximum_points
      pointsStub.mockReturnValueOnce(2);
      expect(iteration.overflowsBy()).toEqual(0);

      // Should return the difference if iteration points are greater than
      // maximum_points
      pointsStub.mockReturnValueOnce(5);
      expect(iteration.overflowsBy()).toEqual(3);
    });

    it('should report how many accepted points it has', function () {
      expect(iteration.acceptedPoints()).toEqual(3);
    });
  });

  describe('filling backlog iterations', function () {
    it('should return how many points are available', function () {
      var pointsStub = vi.spyOn(iteration, 'points');
      pointsStub.mockReturnValueOnce(3);

      iteration.set({ maximum_points: 5 });
      expect(iteration.availablePoints()).toEqual(2);
    });

    it('should always accept chores bugs and releases', function () {
      var stub = vi.fn();
      var story = { get: stub };

      stub.mockImplementation(arg => {
        if (arg === 'story_type') return 'chore';
      });
      expect(iteration.canTakeStory(story)).toBeTruthy();
      stub.mockImplementation(arg => {
        if (arg === 'story_type') return 'bug';
      });
      expect(iteration.canTakeStory(story)).toBeTruthy();
      stub.mockImplementation(arg => {
        if (arg === 'story_type') return 'release';
      });
      expect(iteration.canTakeStory(story)).toBeTruthy();
    });

    it('should not accept anything when isFull is true', function () {
      var stub = vi.fn();
      var story = { get: stub };

      iteration.isFull = true;

      stub.mockImplementation(arg => {
        if (arg === 'story_type') return 'chore';
      });
      expect(iteration.canTakeStory(story)).toBeFalsy();
      stub.mockImplementation(arg => {
        if (arg === 'story_type') return 'bug';
      });
      expect(iteration.canTakeStory(story)).toBeFalsy();
      stub.mockImplementation(arg => {
        if (arg === 'story_type') return 'release';
      });
      expect(iteration.canTakeStory(story)).toBeFalsy();
    });

    it('should accept a feature if there are enough free points', () => {
      vi.spyOn(iteration, 'availablePoints').mockReturnValueOnce(3);
      vi.spyOn(iteration, 'points').mockReturnValueOnce(1);

      var story = { get: vi.fn() };

      story.get.mockImplementationOnce(arg => {
        switch (arg) {
          case 'story_type':
            return 'feature';
          case 'estimate':
            return 3;
        }
      });

      expect(iteration.canTakeStory(story)).toBeTruthy();
    });

    it('should not accept a feature if there are enough free points', function () {
      vi.spyOn(iteration, 'availablePoints').mockReturnValueOnce(3);
      vi.spyOn(iteration, 'points').mockReturnValueOnce(1);

      var story = { get: vi.fn() };

      // Story is too big to fit in iteration
      story.get.mockImplementation(arg => {
        switch (arg) {
          case 'story_type':
            return 'feature';
          case 'estimate':
            return 4;
        }
      });

      expect(iteration.canTakeStory(story)).toBeFalsy();
    });

    // Each iteration should take at least one feature
    it('should always take at least one feature no matter how big', function () {
      var availablePointsStub = vi.spyOn(iteration, 'availablePoints');
      availablePointsStub.mockReturnValueOnce(1);

      var stub = vi.fn();
      var story = { get: stub };
      stub.mockImplementation(arg => {
        switch (arg) {
          case 'story_type':
            return 'feature';
          case 'estimate':
            return 2;
        }
      });

      expect(iteration.points()).toEqual(0);
      expect(iteration.canTakeStory(story)).toBeTruthy();
    });
  });

  describe('isFull flag', function () {
    it('should default to false', function () {
      expect(iteration.isFull).toEqual(false);
    });

    it('should be set to true once canTakeStory has returned false', function () {
      var story = { get: vi.fn() };

      vi.spyOn(iteration, 'availablePoints').mockReturnValueOnce(0);
      vi.spyOn(iteration, 'points').mockReturnValueOnce(1);

      story.get.mockImplementation(arg => {
        switch (arg) {
          case 'story_type':
            return 'feature';
          case 'estimate':
            return 1;
        }
      });

      expect(iteration.isFull).toEqual(false);
      expect(iteration.canTakeStory(story)).toBeFalsy();
      expect(iteration.isFull).toEqual(true);
    });
  });

  describe('createMissingIterations', function () {
    let start;

    beforeEach(function () {
      start = new Iteration({ number: 1 });
    });

    it('should create a range of iterations', function () {
      var end = new Iteration({ number: 5 });
      var iterations = Iteration.createMissingIterations('#done', start, end);
      expect(iterations.length).toEqual(3);
    });

    it('should return an empty array when there is no gap between start and end', function () {
      var end = new Iteration({ number: 2 });
      var iterations = Iteration.createMissingIterations('#done', start, end);
      expect(iterations.length).toEqual(0);
    });

    it('should raise an exception if end number is less than or equal to start', function () {
      var end = new Iteration({ number: 1 });
      var that = start;
      expect(function () {
        Iteration.createMissingIterations('#done', that, end);
      }).toThrow(
        'end iteration number:1 must be greater than start iteration number:2'
      );
    });

    it('should return an empty array when start is undefined and end is number 1', function () {
      var end = new Iteration({ number: 1 });
      var iterations = Iteration.createMissingIterations(
        '#done',
        undefined,
        end
      );
      expect(iterations.length).toEqual(0);
    });

    it('should return a range of iterations when start is undefined', function () {
      var end = new Iteration({ number: 5 });
      var iterations = Iteration.createMissingIterations(
        '#done',
        undefined,
        end
      );
      expect(iterations.length).toEqual(4);
      expect(_.first(iterations).get('number')).toEqual(1);
    });

    it('should return an empty array when start is undefined and end is number 1', function () {
      var end = new Iteration({ number: 1 });
      var iterations = Iteration.createMissingIterations(
        '#done',
        undefined,
        end
      );
      expect(iterations.length).toEqual(0);
    });

    it('should return a range of iterations when start is undefined', function () {
      var end = new Iteration({ number: 5 });
      var iterations = Iteration.createMissingIterations(
        '#done',
        undefined,
        end
      );
      expect(iterations.length).toEqual(4);
      expect(_.first(iterations).get('number')).toEqual(1);
    });
  });

  describe('startDate', function () {
    it('should return the start date', function () {
      var startDate = new Date('2011/09/26');
      var stub = vi.fn();
      stub.mockReturnValueOnce(startDate);
      iteration.project = { getDateForIterationNumber: stub };

      expect(iteration.startDate()).toEqual(startDate);
      expect(stub).toHaveBeenCalledWith(iteration.get('number'));
    });
  });

  describe('stories', function () {
    let acceptedStory;
    let finishedStory;
    let unstartedStory;

    beforeEach(function () {
      var Story = Backbone.Model.extend({ name: 'story' });
      acceptedStory = new Story({ state: 'accepted' });
      finishedStory = new Story({ state: 'finished' });
      unstartedStory = new Story({ state: 'unstarted' });
      var stories = [unstartedStory, acceptedStory, finishedStory];
      iteration.set({ stories: stories });
    });

    it('returns the stories in the order they were added by default', function () {
      expect(iteration.stories()).toEqual([
        unstartedStory,
        acceptedStory,
        finishedStory,
      ]);
    });

    it('returns the stories accepted first if in progress iteration', function () {
      iteration.set({ column: '#in_progress' });
      var stories = iteration.stories();
      expect(stories.length).toEqual(3);
      expect(stories[0]).toEqual(acceptedStory);
    });

    it('returns stories with a given state', function () {
      expect(iteration.storiesWithState('accepted')).toEqual([acceptedStory]);
    });

    it('returns stories except a given state', function () {
      expect(iteration.storiesExceptState('accepted')).toEqual([
        unstartedStory,
        finishedStory,
      ]);
    });
  });
});
