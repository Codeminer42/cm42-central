import moment from 'moment';
import * as Iteration from 'models/beta/iteration';

describe('iteration', function() {
  beforeEach(function() {
    this.clock = sinon.useFakeTimers(new Date('2018-05-01T17:00:00').getTime());
  });

  afterEach(function() {
    this.clock.restore();
  });

  describe('when 1 out of 1 week has passed', function() {
    it('should return 2', function() {
      const sprintNumber = Iteration.getCurrentIteration({
                            iterationLength: 1,
                            startDate: "2018-04-24T16:00:00"
                          });
      expect(sprintNumber).toEqual(2);
    });
  });

  describe("when 3 out of 3 weeks has passed", function() {
    it('should return 2', function() {
      const sprintNumber = Iteration.getCurrentIteration({
                            iterationLength: 3,
                            startDate: "2018-04-10T16:00:00"
                          });
      expect(sprintNumber).toEqual(2);
    });
  });

  describe("when 1 out of 2 weeks has passed", function() {
    it('should return 1', function() {
      const sprintNumber = Iteration.getCurrentIteration({
                            iterationLength: 2,
                            startDate: "2018-04-24T16:00:00"
                          });
      expect(sprintNumber).toEqual(1);
    });
  });

  describe("when a story was acceped a week ago", function() {
    it('should return 1', function() {
      const sprintNumber = Iteration.getIterationForStory(
                            { state: 'accepted', acceptedAt: "2018-04-24T16:00:00" },
                            { startDate: "2018-04-10T16:00:00", iterationLength: 2 }
                          );
      expect(sprintNumber).toEqual(2);
    });
  });

});
