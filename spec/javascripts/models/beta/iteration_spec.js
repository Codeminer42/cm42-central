import * as Iteration from "models/beta/iteration";
import moment from 'moment';

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
        const sprints = Iteration.groupBySprints(
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
      it("should return an array with 3 items", function() {
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

    describe('sprints number', () => {
      describe('when the initialSprintNumber is 15', () => {
        const stories = [
          {
            id: 1,
            position: "3.2",
            state: "unstarted",
            estimate: 2,
            storyType: "feature"
          },
          {
            id: 2,
            position: "10",
            state: "unstarted",
            estimate: 3,
            storyType: "feature"
          },
          {
            id: 3,
            position: "11",
            state: "unstarted",
            estimate: 3,
            storyType: "feature"
          }
        ];

        const project = {
          startDate: "2018-09-03T16:00:00",
          iterationLength: 1,
          defaultVelocity: 2
        };

        it('the first sprint returns 15', () => {
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            15
          );

          expect(sprints[0].number).toBe(15);
        });

        it('the second sprint returns 16', () => {
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            15
          );

          expect(sprints[1].number).toBe(16);
        });

        it('the third sprint returns 17', () => {
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            15
          );

          expect(sprints[2].number).toBe(17);
        });
      });

      describe("when there is no initialSprintNumber", () => {
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

        const project = {
          startDate: "2018-09-03T16:00:00",
          iterationLength: 1,
          defaultVelocity: 2
        };

        it('the first sprint returns 1', () => {
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            undefined
          );

          expect(sprints[0].number).toBe(1);
        });
      });
    });

    describe('sprints startDate', () => {
      describe('when the project starts today and iterationLenght is 1 week', () => {
        const stories = [
          {
            id: 1,
            position: "3.2",
            state: "unstarted",
            estimate: 2,
            storyType: "feature"
          },
          {
            id: 2,
            position: "10",
            state: "unstarted",
            estimate: 3,
            storyType: "feature"
          },
          {
            id: 3,
            position: "11",
            state: "unstarted",
            estimate: 3,
            storyType: "feature"
          }
        ];

        const project = {
          startDate: moment().format(),
          iterationLength: 1,
          defaultVelocity: 2
        };

        const sprints = Iteration.groupBySprints(
          stories,
          project,
          undefined
        );

        it('first sprint starts today', () => {
          const startDate = moment().format("ddd MMM Do Y");

          expect(sprints[0].startDate).toBe(startDate);
        });

        it('second sprint starts 1 week after today', () => {
          const startDate = moment().add(1, 'weeks').format("ddd MMM Do Y");

          expect(sprints[1].startDate).toBe(startDate);
        });

        it('third sprint starts 2 weeks after today', () => {
          const startDate = moment().add(2, 'weeks').format("ddd MMM Do Y");

          expect(sprints[2].startDate).toBe(startDate);
        });
      });

      describe('when the project started 2 weeks ago and iterationLenght is 1 week', () => {
        let projectStartDate;
        let project;
        let sprints;

        const stories = [
          {
            id: 1,
            position: "3.2",
            state: "unstarted",
            estimate: 2,
            storyType: "feature"
          },
          {
            id: 2,
            position: "10",
            state: "unstarted",
            estimate: 3,
            storyType: "feature"
          },
          {
            id: 3,
            position: "11",
            state: "unstarted",
            estimate: 3,
            storyType: "feature"
          }
        ];

        beforeEach(() => {
          projectStartDate = moment().subtract(2, 'weeks');

          project = {
            startDate: projectStartDate.format(),
            iterationLength: 1,
            defaultVelocity: 2
          };

          sprints = Iteration.groupBySprints(
            stories,
            project,
            3
          );
        });

        it('first sprint starts 2 weeks after projectStartDate', () => {
          const startDate = projectStartDate.add(2, 'weeks').format("ddd MMM Do Y");

          expect(sprints[0].startDate).toBe(startDate);
        });

        it('second sprint starts 3 weeks after startDate', () => {
          const startDate = projectStartDate.add(3, 'weeks').format("ddd MMM Do Y");

          expect(sprints[1].startDate).toBe(startDate);
        });
      });
    });

    describe('sprints point', () => {
      describe('when there is two feature stories with 2 and 3 points', () => {
        const stories = [
          {
            id: 1,
            position: "3.2",
            state: "unstarted",
            estimate: 2,
            storyType: "feature"
          },
          {
            id: 2,
            position: "10",
            state: "unstarted",
            estimate: 3,
            storyType: "feature"
          }
        ];

        const project = {
          startDate: moment().format(),
          iterationLength: 1,
          defaultVelocity: 8
        };

        const sprints = Iteration.groupBySprints(
          stories,
          project,
          undefined
        );

        it('returns 5', () => {
          expect(sprints[0].points).toBe(5);
        });
      });

      describe('when there is only one bug story', () => {
        const stories = [
          {
            id: 1,
            position: "3.2",
            state: "unstarted",
            estimate: "",
            storyType: "bug"
          }
        ];

        const project = {
          startDate: moment().format(),
          iterationLength: 1,
          defaultVelocity: 8
        };

        const sprints = Iteration.groupBySprints(
          stories,
          project,
          undefined
        );

        it('returns 0', () => {
          expect(sprints[0].points).toBe(0);
        });
      });

      describe('when there is one bug and one feature with 2 points', () => {
        const stories = [
          {
            id: 1,
            position: "3.2",
            state: "unstarted",
            estimate: "",
            storyType: "bug"
          },
          {
            id: 2,
            position: "4.2",
            state: "unstarted",
            estimate: 2,
            storyType: "feature"
          },
        ];

        const project = {
          startDate: moment().format(),
          iterationLength: 1,
          defaultVelocity: 8
        };

        const sprints = Iteration.groupBySprints(
          stories,
          project,
          undefined
        );

        it('returns 2', () => {
          expect(sprints[0].points).toBe(2);
        });

        it('returns a number', () => {
          expect(typeof (sprints[0].points)).toBe('number');
        });
      });

      describe('when there is two features one with 2 points and other with no estimate', () => {
        const stories = [
          {
            id: 1,
            position: "3.2",
            state: "unstarted",
            estimate: "",
            storyType: "feature"
          },
          {
            id: 2,
            position: "4.2",
            state: "unstarted",
            estimate: 2,
            storyType: "feature"
          },
        ];

        const project = {
          startDate: moment().format(),
          iterationLength: 1,
          defaultVelocity: 8
        };

        const sprints = Iteration.groupBySprints(
          stories,
          project,
          undefined
        );

        it('returns 2', () => {
          expect(sprints[0].points).toBe(2);
        });

        it('returns a number', () => {
          expect(typeof (sprints[0].points)).toBe('number');
        });
      });
    });
  });
});
