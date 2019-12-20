import * as Iteration from "models/beta/iteration";
import moment from 'moment';

describe("iteration", function() {
  describe('calculateRemainingPoints', () => {
    describe('when velocity is greater than points', () => {
      const points = [1,2,3,4,5];

      points.forEach(p => {
        it('returns difference between them', () => {
          const velocity = 10;
          const difference = velocity - p;

          expect(Iteration.calculateRemainingPoints(velocity, p)).toEqual(difference);
        });
      });
    });

    describe('when points are greater than velocity', () => {
      const points = [10,20,30,40,50];

      points.forEach(p => {
        it('returns 0', () => {
          const velocity = 10;

          expect(Iteration.calculateRemainingPoints(velocity, p)).toEqual(0);
        });
      });
    });
  });

  describe('canTakeStory', () => {
    const pointsOptions = [2,4,8,10,15];

    pointsOptions.forEach(points => {
      describe(`when story have ${points} points`, () => {
        const biggerThanPoints = points + 1;
        const smallerThanPoints = points - 1;

        describe('and remaining points of sprint is bigger than story points', () => {
          it('returns truthy', () => {
            const sprint = { remainingPoints: biggerThanPoints };
            const story = { estimate: points, storyType: 'feature' };

            expect(Iteration.canTakeStory(sprint, story)).toBeTruthy();
          });
        });

        describe('and remaining points of sprint is smaller than story points', () => {
          it('returns falsy', () => {
            const sprint = { remainingPoints: smallerThanPoints };
            const story = { estimate: points, storyType: 'feature' };

            expect(Iteration.canTakeStory(sprint, story)).toBeFalsy();
          });
        });
      });
    });
  });

  describe('calculateFillerSprintsQuantity', () => {
    describe('when story have 3 points', () => {
      const storyPoints = 3;

      describe('and velocity is 1', () => {
        const velocity = 1;

        it('returns 2', () => {
          expect(Iteration.calculateFillerSprintsQuantity(storyPoints, velocity)).toEqual(2);
        });
      });

      describe('and velocity is 2', () => {
        const velocity = 2;

        it('returns 1', () => {
          expect(Iteration.calculateFillerSprintsQuantity(storyPoints, velocity)).toEqual(1);
        });
      });

      describe('and velocity is 3', () => {
        const velocity = 3;

        it('returns 0', () => {
          expect(Iteration.calculateFillerSprintsQuantity(storyPoints, velocity)).toEqual(0);
        });
      });

      describe('and velocity is 4', () => {
        const velocity = 4;

        it('returns 0', () => {
          expect(Iteration.calculateFillerSprintsQuantity(storyPoints, velocity)).toEqual(0);
        });
      });

      describe('and velocity is 5', () => {
        const velocity = 5;

        it('returns 0', () => {
          expect(Iteration.calculateFillerSprintsQuantity(storyPoints, velocity)).toEqual(0);
        });
      });
    });
  });

  describe("time related functions", function() {
    let clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers(
        new Date("2018-05-01T17:00:00").getTime()
      );
    });

    afterEach(function() {
      clock.restore();
    });

    describe("when 1 out of 1 week has passed", function() {
      it("returns 2", function() {
        const sprintNumber = Iteration.getCurrentIteration({
          iterationLength: 1,
          startDate: "2018-04-24T16:00:00"
        });
        expect(sprintNumber).toEqual(2);
      });
    });

    describe("when 3 out of 3 weeks has passed", function() {
      it("returns 2", function() {
        const sprintNumber = Iteration.getCurrentIteration({
          iterationLength: 3,
          startDate: "2018-04-10T16:00:00"
        });
        expect(sprintNumber).toEqual(2);
      });
    });

    describe("when 1 out of 2 weeks has passed", function() {
      it("returns 1", function() {
        const sprintNumber = Iteration.getCurrentIteration({
          iterationLength: 2,
          startDate: "2018-04-24T16:00:00"
        });
        expect(sprintNumber).toEqual(1);
      });
    });

    describe("when a story was acceped a week ago", function() {
      it("returns 2", function() {
        const sprintNumber = Iteration.getIterationForStory(
          { state: "accepted", acceptedAt: "2018-04-24T16:00:00" },
          { startDate: "2018-04-10T16:00:00", iterationLength: 2 }
        );
        expect(sprintNumber).toEqual(2);
      });
    });
  });

  describe("when calculating sprint velocity", function() {
    let project
    beforeEach(() =>
    project = {
      startDate: "2018-09-03T16:00:00",
      iterationLength: 1,
      defaultVelocity: 2
    })

    describe("when there are less than 3 past iterations", function() {
      it("return the same value as default velocity", () => {
        const sprintVelocity = Iteration.sprintVelocity(
          project,
          [{points: 3}]
        );
        expect(sprintVelocity).toEqual(project.defaultVelocity);
      });
    });
    describe("when there more than 3 past iterations", function() {
      it("return the medium of the last 3", () => {
        const sprintVelocity = Iteration.sprintVelocity(
          project,
          [{points: 3},{points: 3}, {points: 4}, {points: 5}]
        );
        expect(sprintVelocity).toEqual(4);
      });
    });
  });


  describe("when reducing stories to sprints", function() {
    describe('when default velocity is 2', () => {
      let project;

      beforeEach(() => {
        project = {
          startDate: "2018-09-03T16:00:00",
          iterationLength: 1,
          currentSprintVelocity: 2
        };
      });

      describe("with empty array of stories", function() {
        it("return an empty array of sprints", () => {
          const stories = [];
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );
          expect(sprints).toEqual([]);
        });
      });

      describe("with 2 unstarted features with 1 point", function() {
        let stories

        beforeEach(() => {
          stories = [
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
        });

        it("return an array with 1 item ", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );
          expect(sprints.length).toEqual(1);
        });

        it('return an array with 2 stoies in first position', () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );
          expect(sprints[0].stories.length).toEqual(2);
        });
      });

      describe("with started, finished and delivered stories", function() {
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
        it("return an array with 3 items", function() {

          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );
          expect(sprints.length).toEqual(3);
        });
      });

      describe("with 1 unstarted features with 2 points", () => {
        let stories

        beforeEach(() => {
          stories = [
            {
              id: 1,
              position: "1",
              state: "unstarted",
              estimate: 2,
              storyType: "feature"
            },
          ];

        });

        it("return an array with 1 item", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );
          expect(sprints.length).toEqual(1);
        });

        it('return an array with just one story in first position', () => {
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );
          const initialSprintNumber = Iteration.getCurrentIteration(project);

          expect(sprints[0].stories.length).toEqual(1);
        });
      });

      describe('sprints number', () => {
        describe('when the initialSprintNumber is 15', () => {
          let project
          let stories
          beforeEach(() => {
            stories = [
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
                estimate: 2,
                storyType: "feature"
              },
              {
                id: 3,
                position: "11",
                state: "unstarted",
                estimate: 2,
                storyType: "feature"
              }
            ];

            project = {
              startDate: "2018-09-03T16:00:00",
              iterationLength: 1,
              currentSprintVelocity: 2
            };

          })

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
          let stories
          let project
          beforeEach(() => {
            stories = [
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

            project = {
              startDate: "2018-09-03T16:00:00",
              iterationLength: 1,
              currentSprintVelocity: 2
            };
          })

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
          let stories
          let project
          beforeEach(() => {
            stories = [
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
                estimate: 2,
                storyType: "feature"
              },
              {
                id: 3,
                position: "11",
                state: "unstarted",
                estimate: 2,
                storyType: "feature"
              }
            ];

            project = {
              startDate: moment().format("YYYY/MM/DD"),
              iterationLength: 1,
              currentSprintVelocity: 2
            };
          })

          it('first sprint starts today', () => {
            const sprints = Iteration.groupBySprints(
              stories,
              project,
              undefined
            );
            const startDate = moment().format("YYYY/MM/DD");

            expect(sprints[0].startDate).toBe(startDate);
          });

          it('second sprint starts 1 week after today', () => {
            const sprints = Iteration.groupBySprints(
              stories,
              project,
              undefined
            );
            const startDate = moment().add(1, 'weeks').format("YYYY/MM/DD");

            expect(sprints[1].startDate).toBe(startDate);
          });

          it('third sprint starts 2 weeks after today', () => {
            const sprints = Iteration.groupBySprints(
              stories,
              project,
              undefined
            );
            const startDate = moment().add(2, 'weeks').format("YYYY/MM/DD");

            expect(sprints[2].startDate).toBe(startDate);
          });
        });

        describe('when the project started 2 weeks ago and iterationLenght is 1 week', () => {
          let projectStartDate;
          let project;
          let sprints;
          let stories
          beforeEach(() => {
            stories = [
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

            projectStartDate = moment().subtract(2, 'weeks');

            project = {
              startDate: projectStartDate.format("YYYY/MM/DD"),
              iterationLength: 1,
              currentSprintVelocity: 2
            };
          })

          it('first sprint starts 2 weeks after projectStartDate', () => {
            const sprints = Iteration.groupBySprints(
              stories,
              project,
              3
            );

            const startDate = projectStartDate.add(2, 'weeks').format("YYYY/MM/DD");

            expect(sprints[0].startDate).toBe(startDate);
          });

          it('second sprint starts 3 weeks after startDate', () => {
            const sprints = Iteration.groupBySprints(
              stories,
              project,
              3
            );
            const startDate = projectStartDate.add(3, 'weeks').format("YYYY/MM/DD");

            expect(sprints[1].startDate).toBe(startDate);
          });
        });
      });

    describe('when current sprint velocity is 3', () => {
      const project = {
        startDate: "2018-09-03T16:00:00",
        iterationLength: 1,
        currentSprintVelocity: 3
      };


      describe("with unstarted features", function() {
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

        it("return an array with 1 item", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints.length).toEqual(1);
        });

        it('return an array with one sprint with 2 points', () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber,
            []
          );

          expect(sprints[0].points).toEqual(2);
        });

        it('return an array with one sprint with 1 remaining point', () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[0].remainingPoints).toEqual(1);
        });
      });

      describe("with 3 unstarted features with 1, 3 and 1 points", function() {
        const stories = [
          {
            id: 1,
            position: "1",
            state: "unstarted",
            estimate: 1,
            storyType: "feature"
          },
          {
            id: 2,
            position: "2",
            state: "unstarted",
            estimate: 3,
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

        it("return an array with 3 items", () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints.length).toEqual(3);
        });

        it("return an array with first position with 1 point", () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[0].points).toEqual(1);
        });

        it("return an array with second position with 3 points", () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[1].points).toEqual(3);
        });

        it("return an array with third position with 1 point", () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[2].points).toEqual(1);
        });

        it("return an array with third position with 2 remaining points", () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[2].remainingPoints).toEqual(2);
        });
      });

      describe("when have 3 stories, 1 unstarted feature and 2 started features", function() {
        let stories
        beforeEach(() => {
          stories = [
            {
              id: 1,
              position: "1",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 2,
              position: "2",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 3,
              position: "3",
              state: "unstarted",
              estimate: 4,
              storyType: "feature"
            },
          ];
        })

        it("return an array with 3 items", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints.length).toEqual(3);
        });

        it("return an array with last sprint beeing filler", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[2].isFiller).toBeTruthy();
        });

        it("return an array with first sprint with 8 points", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[0].points).toEqual(8);
        });

        it("return an array with last sprint with 4 points", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[2].points).toEqual(4);
        });

        it("return an array with sprint of middle with 0 points", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[1].points).toEqual(0);
        });
      });

      describe('when have 10 stories no feature', () => {
        let stories
        beforeEach(() => {
          stories = [
            {
              id: 1,
              position: "1",
              storyType: "bug"
            },
            {
              id: 2,
              position: "2",
              storyType: "bug"
            },
            {
              id: 3,
              position: "3",
              storyType: "bug"
            },
            {
              id: 4,
              position: "4",
              storyType: "bug"
            },
            {
              id: 5,
              position: "5",
              storyType: "bug"
            },
            {
              id: 6,
              position: "6",
              storyType: "bug"
            },
            {
              id: 7,
              position: "7",
              storyType: "bug"
            },
            {
              id: 8,
              position: "8",
              storyType: "bug"
            },
            {
              id: 9,
              position: "9",
              storyType: "bug"
            },
            {
              id: 10,
              position: "10",
              storyType: "bug"
            },
          ];
        })

        it("return an array with 1 item", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints.length).toEqual(1);
        });

        it("return one sprint with 0 points", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[0].points).toEqual(0);
        });
      });

      describe('when 4 stories no feature and 1 story feature', () => {
        let stories
        beforeEach(() => {

          stories = [
            {
              id: 1,
              position: "1",
              storyType: "bug"
            },
            {
              id: 2,
              position: "2",
              storyType: "bug"
            },
            {
              id: 3,
              position: "3",
              storyType: "bug"
            },
            {
              id: 4,
              position: "4",
              storyType: "bug"
            },
            {
              id: 5,
              position: "5",
              storyType: "feature",
              estimate: "3"
            },
          ];
        })

        it("return an array with 1 item", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints.length).toEqual(1);
        });

        it("return one sprint with 3 points", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[0].points).toEqual(3);
        });
      });

      describe('when have 10 started stories with 4 points each', () => {
        let stories
        beforeEach(() => {
          stories = [
            {
              id: 1,
              position: "1",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 2,
              position: "2",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 3,
              position: "3",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 4,
              position: "4",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 5,
              position: "5",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 6,
              position: "6",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 7,
              position: "7",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 8,
              position: "8",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 9,
              position: "9",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 10,
              position: "10",
              state: "started",
              estimate: 4,
              storyType: "feature"
            },
          ];
        })

        it("return an array with 1 item", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints.length).toEqual(1);
        });

        it("return one sprint with 40 points", function() {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[0].points).toEqual(40);
        });
      });

      describe('when have 3 unstarted stories of 4 points', () => {
        let stories
        beforeEach(() => {
          stories = [
            {
              id: 1,
              position: "1",
              state: "unstarted",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 2,
              position: "2",
              state: "unstarted",
              estimate: 4,
              storyType: "feature"
            },
            {
              id: 3,
              position: "3",
              state: "unstarted",
              estimate: 4,
              storyType: "feature"
            },
          ];
        })

        it("return an array with 5 items", () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints.length).toEqual(5);
        });

        it("checks if the first element have 4 points", () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[0].points).toEqual(4);
        });

        it("checks if the second element have 0 points", () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[1].points).toEqual(0);
        });

        it("checks if the second element have 2 points", () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[1].remainingPoints).toEqual(2);
        });

        it("checks if the second element is filler", () => {
          const initialSprintNumber = Iteration.getCurrentIteration(project);
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            initialSprintNumber
          );

          expect(sprints[1].isFiller).toBeTruthy();
        });
      });
    });

    describe('sprints point', () => {
      let project
      beforeEach(() => {
        project = {
          startDate: moment().format(),
          iterationLength: 1,
          currentSprintVelocity: 8
        };
      })

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

        it('returns 5', () => {
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            undefined
          );
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

        it('returns 0', () => {
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            undefined
          );
          expect(sprints[0].points).toBe(0);
        });
      });

      describe('when there is one bug and one feature with 2 points', () => {
        let stories
        beforeEach(() => {
          stories = [
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
        })

        it('returns 2', () => {
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            undefined
          );
          expect(sprints[0].points).toBe(2);
        });

        it('returns a number', () => {
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            undefined
          );
          expect(typeof (sprints[0].points)).toBe('number');
        });
      });

      describe('when there is two features one with 2 points and other with no estimate', () => {
        let stories
        beforeEach(() => {
          stories = [
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
        })

        it('returns 2', () => {
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            undefined
          );
          expect(sprints[0].points).toBe(2);
        });

        it('returns a number', () => {
          const sprints = Iteration.groupBySprints(
            stories,
            project,
            undefined
          );
          expect(typeof (sprints[0].points)).toBe('number');
        });
      });
    });
  });
  });

  describe('causesOverflow', () => {
    describe('when story is feature', () => {
      describe('and have 2 points', () => {
        let story
        beforeEach(() => {
          story = {
            storyType: 'feature',
            estimate: 2
          }
        })

        describe('and velocity is 3', () => {
          it('returns truphy', () => {
            expect(Iteration.causesOverflow(story, 3)).toBeFalsy();
          })
        });

        describe('and velocity is 1', () => {
          it('returns falsy', () => {
            expect(Iteration.causesOverflow(story, 1)).toBeTruthy();
          });
        });
      });
    });

    describe('when story is not a feature', () => {
      const story = {
        storyType: 'bug'
      }

      it('returns falsy', () => {
        expect(Iteration.causesOverflow(story, 1)).toBeFalsy();
      });
    });
  });
});
