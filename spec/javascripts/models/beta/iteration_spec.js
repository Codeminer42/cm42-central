import * as Iteration from "models/beta/iteration";

describe("iteration", function() {
  describe("time related functions", function() {
    beforeEach(function() {
      this.clock = sinon.useFakeTimers(
        new Date("2018-05-01T17:00:00").getTime()
      );
    });

    afterEach(function() {
      this.clock.restore();
    });

    describe("when 1 out of 1 week has passed", function() {
      it("should return 2", function() {
        const sprintNumber = Iteration.getCurrentIteration({
          iterationLength: 1,
          startDate: "2018-04-24T16:00:00"
        });
        expect(sprintNumber).toEqual(2);
      });
    });

    describe("when 3 out of 3 weeks has passed", function() {
      it("should return 2", function() {
        const sprintNumber = Iteration.getCurrentIteration({
          iterationLength: 3,
          startDate: "2018-04-10T16:00:00"
        });
        expect(sprintNumber).toEqual(2);
      });
    });

    describe("when 1 out of 2 weeks has passed", function() {
      it("should return 1", function() {
        const sprintNumber = Iteration.getCurrentIteration({
          iterationLength: 2,
          startDate: "2018-04-24T16:00:00"
        });
        expect(sprintNumber).toEqual(1);
      });
    });

    describe("when a story was acceped a week ago", function() {
      it("should return 2", function() {
        const sprintNumber = Iteration.getIterationForStory(
          { state: "accepted", acceptedAt: "2018-04-24T16:00:00" },
          { startDate: "2018-04-10T16:00:00", iterationLength: 2 }
        );
        expect(sprintNumber).toEqual(2);
      });
    });
  });

  describe("when reducing stories to sprints", function() {
    beforeEach(function() {
      this.project = {
        startDate: "2018-09-03T16:00:00",
        iterationLength: 1,
        defaultVelocity: 2
      };
      this.initialSprintNumber = Iteration.getCurrentIteration(this.project);
    });

    describe("with empty array of stories", function() {
      it("should return an empty array of sprints", function() {
        const stories = [];
        sprints = Iteration.groupBySprints(
          stories,
          this.project,
          this.initialSprintNumber
        );
        expect(sprints).toEqual([]);
      });
    });

    describe("with 2 unstarted features with 1 point", function() {
      it("should return an array with 1 item", function() {
        const stories = [
          {
            id: 1,
            position: "3.2",
            state: "unstarted",
            estimate: 1,
            storyType: "feature"
          },
          {
            id: 2,
            position: "10",
            state: "unstarted",
            estimate: 1,
            storyType: "feature"
          }
        ];
        
        const sprints = Iteration.groupBySprints(
          stories,
          this.project,
          this.initialSprintNumber
        );
       
        expect(sprints.length).toEqual(1);
      });
    });

    describe("with 3 unstarted features with 2, 5 and 1 points and velocity 3", function() {
      it("should return an array with 3 items", function() {
        const stories = [
          {
            id: 1,
            position: "1",
            state: "unstarted",
            estimate: 2,
            storyType: "feature"
          },
          {
            id: 2,
            position: "2",
            state: "unstarted",
            estimate: 5,
            storyType: "feature"
          },
          {
            id: 3,
            position: "3",
            state: "unstarted",
            estimate: 1,
            storyType: "feature"
          }
        ];

        this.project.defaultVelocity = 3;
        const sprints = Iteration.groupBySprints(
          stories,
          this.project,
          this.initialSprintNumber
        );
        
        expect(sprints.length).toEqual(3);
      });
    });

    describe("with 1 unstarted features with 8 points and velocity 3", function() {
      it("should return an array with 3 items", function() {
        const stories = [
          {
            id: 1,
            position: "1",
            state: "unstarted",
            estimate: 8,
            storyType: "feature"
          },
        ];
        this.project.defaultVelocity = 3;
        const sprints = Iteration.groupBySprints(
          stories,
          this.project,
          this.initialSprintNumber
        );

        expect(sprints.length).toEqual(3);
      });
    });

    describe("with started, finished and delivered stories", function() {
      it("should return an array with 2 items", function() {
        const stories = [
          {
            id: 1,
            position: "1.5",
            state: "accepted",
            acceptedAt: "2018-09-03T16:36:20.811Z",
            estimate: 1,
            storyType: "feature"
          },
          {
            id: 3,
            position: "3.2",
            state: "unstarted",
            estimate: 2,
            storyType: "feature"
          },
          {
            id: 4,
            position: "7.5",
            state: "started",
            startedAt: "2018-09-03T16:36:20.811Z",
            estimate: 1,
            storyType: "feature"
          },
          {
            id: 5,
            position: "3.7",
            state: "finished",
            estimate: 1,
            storyType: "feature"
          },
          {
            id: 6,
            position: "4.9",
            state: "delivered",
            deliveredAt: "2018-09-03T16:36:20.811Z",
            estimate: 1,
            storyType: "feature"
          },
          {
            id: 7,
            position: "10",
            state: "unstarted",
            estimate: 1,
            storyType: "feature"
          }
        ];

        const sprints = Iteration.groupBySprints(
          stories,
          this.project,
          this.initialSprintNumber
        );
        expect(sprints.length).toEqual(3);
      });
    });
  });
});
