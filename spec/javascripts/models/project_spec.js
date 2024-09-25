import Cookies from 'js-cookie';
import Project from 'models/project';
import Iteration from 'models/iteration';

describe('Project model', function () {
  let story;
  let project;

  beforeEach(function () {
    Cookies.set('current_flow', 'progress_to_left', { expires: 365 });

    var Story = Backbone.Model.extend({
      name: 'story',
      fetch: function () {},
      position: function () {},
      labels: function () {
        return [];
      },
    });
    story = new Story({ id: 456 });

    project = new Project({
      id: 999,
      title: 'Test project',
      point_values: [0, 1, 2, 3],
      last_changeset_id: null,
      iteration_start_day: 1,
      iteration_length: 1,
      default_flow: Cookies.get('current_flow'),
      current_flow: Cookies.get('current_flow'),
    });

    project.projectBoard.stories.add(story);
  });

  describe('when instantiated', function () {
    it('should exhibit attributes', function () {
      expect(project.get('point_values')).toEqual([0, 1, 2, 3]);
    });

    it('should set up a story collection', function () {
      expect(project.projectBoard.stories).toBeDefined();
      expect(project.projectBoard.stories.url).toEqual('/projects/999/stories');
      // Sets up a reference on the collection to itself
      expect(project.projectBoard.project).toBe(project);
    });

    it('should set up a user collection', function () {
      expect(project.users).toBeDefined();
      expect(project.users.url).toEqual('/projects/999/users');
      // Sets up a reference on the collection to itself
      expect(project.users.project).toBe(project);
    });

    it('should have a default velocity of 10', function () {
      expect(project.get('default_velocity')).toEqual(10);
    });

    it('should have a default story flow', function () {
      expect(project.get('default_flow')).toEqual('progress_to_left');
    });
  });

  describe('url', function () {
    it('should have a url', function () {
      expect(project.url()).toEqual('/projects/999');
    });
  });

  describe('changesets', function () {
    it('should load changesets when last_changeset_id is changed', function () {
      var server = sinon.fakeServer.create();
      var spy = vi.spyOn(project, 'handleChangesets');
      var changesets = [
        { changeset: { id: 2, story_id: 456, project_id: 789 } },
      ];
      server.respondWith('GET', '/projects/999/changesets?from=0&to=2', [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(changesets),
      ]);

      expect(project.get('last_changeset_id')).toBeNull();
      project.set({ last_changeset_id: 2 });

      expect(server.requests.length).toEqual(1);

      server.respond();

      expect(spy).toHaveBeenCalledWith(changesets);

      server.mockRestore();
    });

    it('should reload changed stories from changesets', function () {
      var changesets = [
        { changeset: { id: 123, story_id: 456, project_id: 789 } },
      ];
      var getSpy = vi.spyOn(project.projectBoard.stories, 'get');
      var fetchSpy = vi.spyOn(story, 'fetch');

      project.handleChangesets(changesets);

      expect(getSpy).toHaveBeenCalledWith(456);
      expect(fetchSpy).toHaveBeenCalled();
    });

    it('should load new stories from changesets', function () {
      var story_json = { story: { id: 987, title: 'New changeset story' } };
      var server = sinon.fakeServer.create();
      server.respondWith('GET', '/projects/999/stories/987', [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(story_json),
      ]);

      var changesets = [
        { changeset: { id: 123, story_id: 987, project_id: 789 } },
      ];
      var getSpy = vi.spyOn(project.projectBoard.stories, 'get');
      var addSpy = vi.spyOn(project.projectBoard.stories, 'add');
      var initial_collection_length = project.projectBoard.stories.length;

      project.handleChangesets(changesets);

      expect(getSpy).toHaveBeenCalled();
      expect(addSpy).toHaveBeenCalled();
      expect(project.projectBoard.stories.length).toEqual(
        initial_collection_length + 1
      );
      expect(project.projectBoard.stories.get(987).get('title')).toEqual(
        'New changeset story'
      );
    });

    it('should only reload a story once if present in multiple changesets', function () {
      var story_json = { story: { id: 987, title: 'New changeset story' } };
      var server = sinon.fakeServer.create();
      server.respondWith('GET', '/projects/999/stories/987', [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(story_json),
      ]);

      // set of changes represents the same story modified twice.  It
      // should only be loaded once.
      var changesets = [
        { changeset: { id: 1, story_id: 987, project_id: 789 } },
        { changeset: { id: 2, story_id: 987, project_id: 789 } },
      ];

      project.handleChangesets(changesets);
      expect(server.requests.length).toEqual(1);
    });
  });

  describe('iterations', function () {
    it('should get the right iteration number for a given date', function () {
      // is a Monday
      project.set({ start_date: '2011/07/25' });

      var compare_date = new Date('2011/07/25');
      expect(project.getIterationNumberForDate(compare_date)).toEqual(1);

      compare_date = new Date('2011/08/01');
      expect(project.getIterationNumberForDate(compare_date)).toEqual(2);

      // With a 2 week iteration length, the date above will still be in
      // iteration 1
      project.set({ iteration_length: 2 });
      expect(project.getIterationNumberForDate(compare_date)).toEqual(1);
    });

    it('should return the current iteration number', function () {
      expect(project.currentIterationNumber()).toEqual(1);
    });

    it('should return the date for an iteration number', function () {
      // is a Monday
      project.set({ start_date: '2011/07/25' });

      expect(project.getDateForIterationNumber(1)).toEqual(
        new Date('2011/07/25')
      );
      expect(project.getDateForIterationNumber(5)).toEqual(
        new Date('2011/08/22')
      );

      project.set({ iteration_length: 4 });
      expect(project.getDateForIterationNumber(1)).toEqual(
        new Date('2011/07/25')
      );
      expect(project.getDateForIterationNumber(5)).toEqual(
        new Date('2011/11/14')
      );

      // Sunday
      project.set({ iteration_start_day: 0 });
      expect(project.getDateForIterationNumber(1)).toEqual(
        new Date('2011/07/24')
      );
      expect(project.getDateForIterationNumber(5)).toEqual(
        new Date('2011/11/13')
      );

      // Tuesday - should evaluate to the Tuesday before the explicitly
      // set start date (Monday)
      project.set({ iteration_start_day: 2 });
      expect(project.getDateForIterationNumber(1)).toEqual(
        new Date('2011/07/19')
      );
      expect(project.getDateForIterationNumber(5)).toEqual(
        new Date('2011/11/08')
      );
    });

    it('should initialize with an array of iterations', function () {
      expect(project.iterations).toEqual([]);
    });

    it('should get all the done iterations', function () {
      var doneIteration = {
        get: vi.fn().mockImplementation(arg => {
          if (arg === 'column') return '#done';
        }),
      };
      var inProgressIteration = {
        get: vi.fn().mockImplementation(arg => {
          if (arg === 'column') return '#in_progress';
        }),
      };
      var backlogIteration = {
        get: vi.fn().mockImplementation(arg => {
          if (arg === 'column') return '#backlong';
        }),
      };
      var chillyBinIteration = {
        get: vi.fn().mockImplementation(arg => {
          if (arg === 'column') return '#chilly_bin';
        }),
      };

      project.iterations = [
        doneIteration,
        inProgressIteration,
        backlogIteration,
        chillyBinIteration,
      ];

      expect(project.doneIterations()).toEqual([doneIteration]);
    });
  });

  describe('start date', function () {
    it('should return the start date', function () {
      // Date is a Monday, and day 1 is Monday
      project.set({ start_date: '2011/09/12', iteration_start_day: 1 });
      expect(project.startDate()).toEqual(new Date('2011/09/12'));

      // If the project start date has been explicitly set to a Thursday, but
      // the iteration_start_day is Monday, the start date should be the Monday
      // that immeadiatly preceeds the Thursday.
      project.set({ start_date: '2011/07/28' });
      expect(project.startDate()).toEqual(new Date('2011/07/25'));

      // The same, but time the iteration start day is 'after' the start
      // date day, in ordinal terms, e.g. iteration start date is a Saturday,
      // project start date is a Thursday.  The Saturday prior to the Thursday
      // should be returned.
      project.set({ iteration_start_day: 6 });
      expect(project.startDate()).toEqual(new Date('2011/07/23'));

      // If the project start date is not set, it should be considered as the
      // first iteration start day prior to today.
      // FIXME - Stubbing Date is not working
      var expected_date = new Date('2011/07/23');
      var fake_today = new Date('2011/07/29');
      // Stop JSHINT complaining about overriding Date
      /*global Date: true*/
      project.today = vi.fn().mockReturnValueOnce(fake_today);
      project.unset('start_date');
      expect(project.startDate()).toEqual(expected_date);
    });
  });

  describe('velocity', function () {
    it('returns the default velocity when done iterations are empty', function () {
      project.set({ default_velocity: 999 });
      expect(project.velocity()).toEqual(999);
    });

    it('should return velocity', function () {
      var doneIterations = _.map([1, 2, 3, 4, 5], function (i) {
        return { points: vi.fn().mockReturnValueOnce(i) };
      });
      vi.spyOn(project, 'doneIterations').mockImplementation(() => doneIterations);

      // By default, should take the average of the last 3 iterations,
      // (3 + 4 + 5) = 12 / 3 = 4
      expect(project.velocity()).toEqual(4);
    });

    it('should ignore zero points done iterations while calculating velocity', function () {
      var doneIterations = _.map([1, 2, 0, 4, 5], function (i) {
        return { points: vi.fn().mockReturnValueOnce(i) };
      });
      vi.spyOn(project, 'doneIterations').mockImplementation(() => doneIterations);

      // By default, should take the average of the last 3 iterations,
      // (2 + 4 + 5) = 11 / 3 = 5
      expect(project.velocity()).toEqual(3);
    });

    it('should floor the velocity when it returns a fraction', function () {
      var doneIterations = _.map([3, 2, 2], function (i) {
        return { points: vi.fn().mockReturnValueOnce(i) };
      });
      vi.spyOn(project, 'doneIterations').mockImplementation(() => doneIterations);

      // Should floor the result
      // (3 + 2 + 2) = 7 / 3 = 2.333333
      expect(project.velocity()).toEqual(2);
    });

    it('should return the velocity when few iterations are complete', function () {
      // Still calculate the average correctly if fewer than the expected
      // number of iterations have been completed.
      var doneIterations = _.map([3, 1], function (i) {
        return { points: vi.fn().mockReturnValueOnce(i) };
      });
      
      vi.spyOn(project, 'doneIterations').mockImplementation(() => doneIterations);

      expect(project.velocity()).toEqual(2);
    });

    it('should not return less than 1', function () {
      var doneIterations = _.map([0, 0, 0], function (i) {
        return { points: vi.fn().mockReturnValueOnce(i) };
      });
      vi.spyOn(project, 'doneIterations').mockImplementation(() => doneIterations);

      expect(project.velocity()).toEqual(1);
    });

    describe('when velocity is not set', function () {
      describe('velocityIsFake', function () {
        it('should be false', function () {
          expect(project.velocityIsFake()).toBeFalsy();
        });
      });

      it('returns the default velocity', function () {
        project.set({ default_velocity: 99 });
        expect(project.velocity()).toEqual(99);
      });
    });

    describe('when velocity is set to 20', function () {
      beforeEach(function () {
        project.velocity(20);
      });

      describe('velocityIsFake', function () {
        it('should be true', function () {
          expect(project.velocityIsFake()).toBeTruthy();
        });
      });

      it('returns 20', function () {
        expect(project.velocity()).toEqual(20);
      });
    });

    describe('when velocity is set to less than 1', function () {
      beforeEach(function () {
        project.velocity(0);
      });

      it('sets the velocity to 1', function () {
        expect(project.velocity()).toEqual(1);
      });
    });

    describe('when velocity is set to the same as the real value', function () {
      describe('velocity', function () {
        beforeEach(function () {
          project.set({ userVelocity: 20, velocityIsFake: true });
          project.calculateVelocity = function () {
            return 20;
          };
          project.velocity(20);
        });

        it('should unset userVelocity', function () {
          expect(project.get('userVelocity')).toBeUndefined();
        });

        it('should be false', function () {
          expect(project.velocityIsFake()).toBeFalsy();
        });
      });
    });

    describe('revertVelocity', function () {
      beforeEach(function () {
        project.set({ userVelocity: 999, velocityIsFake: true });
      });

      it('unsets userVelocity', function () {
        project.revertVelocity();
        expect(project.get('userVelocity')).toBeUndefined();
      });

      it('sets velocityIsFake to false', function () {
        project.revertVelocity();
        expect(project.velocityIsFake()).toBeFalsy();
      });
    });
  });

  describe('appendIteration', function () {
    let iteration;

    beforeEach(function () {
      iteration = {
        get: vi.fn(),
      };
    });

    it('should add the first iteration to the array', function () {
      var stub = vi.spyOn(Iteration, 'createMissingIterations');
      stub.mockReturnValueOnce([]);
      project.appendIteration(iteration);
      expect(_.last(project.iterations)).toEqual(iteration);
      expect(project.iterations.length).toEqual(1);
      stub.mockRestore();
    });

    it('should create missing iterations if required', function () {
      var spy = vi.spyOn(Iteration, 'createMissingIterations');
      vi.spyOn(iteration, 'get').mockImplementation(arg => {
        if (arg === 'number') return 1;
      });
      project.iterations.push(iteration);
      var currentIteration = {
        get: vi.fn().mockImplementation(arg => {
          if (arg === 'number') return 5;
        }),
      };
      project.appendIteration(currentIteration, '#done');
      expect(spy).toHaveBeenCalledWith('#done', iteration, currentIteration);
      expect(project.iterations.length).toEqual(5);
    });
  });

  describe('columns', function () {
    it('should define the columns', function () {
      expect(project.columnIds).toEqual([
        '#done',
        '#in_progress',
        '#backlog',
        '#chilly_bin',
        '#search_results',
        '#epic',
      ]);
    });

    it('should return the columns after a given column', function () {
      expect(project.columnsAfter('#done')).toEqual([
        '#in_progress',
        '#backlog',
        '#chilly_bin',
        '#search_results',
        '#epic',
      ]);
      expect(project.columnsAfter('#in_progress')).toEqual([
        '#backlog',
        '#chilly_bin',
        '#search_results',
        '#epic',
      ]);
      expect(project.columnsAfter('#backlog')).toEqual([
        '#chilly_bin',
        '#search_results',
        '#epic',
      ]);
      expect(project.columnsAfter('#chilly_bin')).toEqual([
        '#search_results',
        '#epic',
      ]);

      var currentProject = project;
      expect(function () {
        currentProject.columnsAfter('#foobar');
      }).toThrow('#foobar is not a valid column');
    });

    it('should return the columns before a given column', function () {
      expect(project.columnsBefore('#done')).toEqual([]);
      expect(project.columnsBefore('#in_progress')).toEqual(['#done']);
      expect(project.columnsBefore('#backlog')).toEqual([
        '#done',
        '#in_progress',
      ]);
      expect(project.columnsBefore('#chilly_bin')).toEqual([
        '#done',
        '#in_progress',
        '#backlog',
      ]);

      expect(project.columnsBefore('#search_results')).toEqual([
        '#done',
        '#in_progress',
        '#backlog',
        '#chilly_bin',
      ]);

      expect(project.columnsBefore('#epic')).toEqual([
        '#done',
        '#in_progress',
        '#backlog',
        '#chilly_bin',
        '#search_results',
      ]);

      let currentProject = project;
      expect(function () {
        currentProject.columnsBefore('#foobar');
      }).toThrow('#foobar is not a valid column');
    });
  });

  describe('rebuildIterations', function () {
    beforeEach(function () {
      project.projectBoard.stories.invoke = vi.fn();
    });

    it('triggers a rebuilt-iterations event', function () {
      var stub = vi.fn();
      project.on('rebuilt-iterations', stub);
      project.rebuildIterations();
      expect(stub).toHaveBeenCalled();
    });
  });

  describe('toggleStoryFlow', function () {
    it('should be able to toggle current_flow value', function () {
      project.toggleStoryFlow();
      expect(project.get('current_flow')).toBe('progress_to_right');

      project.toggleStoryFlow();
      expect(project.get('current_flow')).toBe('progress_to_left');
    });

    it('should be able to save the current story flow on cookies', function () {
      project.toggleStoryFlow();
      expect(Cookies.get('current_flow')).toBe('progress_to_right');
    });
  });
});
