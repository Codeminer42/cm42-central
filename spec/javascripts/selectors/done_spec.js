import { mountPastIterations } from '../../../app/assets/javascripts/selectors/done';

describe('Done selector functions', () => {
  describe('mountPastIterations', () => {
    const stories = [
      {
        id: 1,
        position: '4.5',
        state: 'rejected',
        estimate: 1,
      },
      {
        id: 2,
        position: '1.5',
        state: 'accepted',
        acceptedAt: '2018-08-06T16:36:20.811Z',
        estimate: 1,
      },
      {
        id: 3,
        position: '3.2',
        state: 'unstarted',
        estimate: 1,
      },
      {
        id: 4,
        position: '3.2',
        state: 'unstarted',
        estimate: 1,
      },
    ];

    const iterations = [
      {
        iterationNumber: 1,
        startDate: '',
        storyIds: [],
        endDate: '',
      },
      {
        iterationNumber: 2,
        startDate: '',
        storyIds: [1,2,3],
        endDate: '',
      },
      {
        iterationNumber: 3,
        startDate: '',
        storyIds: [4],
        endDate: '',
      }
    ]

    describe('when have not stories', () => {
      let changedIterations;

      beforeEach(() => {
        changedIterations = mountPastIterations(iterations, []);
      });

      it('returns the sprints list reversed', () => { 
        expect(changedIterations).toEqual([
          {
            iterationNumber: 3,
            number: 3,
            startDate: '',
            storyIds: [4],
            endDate: '',
            stories: []
          },
          {
            iterationNumber: 2,
            number: 2,
            startDate: '',
            storyIds: [1,2,3],
            endDate: '',
            stories: []
          },
          {
            iterationNumber: 1,
            number: 1,
            startDate: '',
            storyIds: [],
            endDate: '',
            stories: []
          }
        ]);
      });
    });

    describe('when have 4 stories', () => {
      let changedIterations;

      beforeEach(() => {
        changedIterations = mountPastIterations(iterations, stories);
      });
      
      it('return iteration 2 with 0 stories', () => {
        expect(changedIterations[2].stories.length).toEqual(0);
      });

      it('return iteration 1 with 3 stories', () => {
        expect(changedIterations[1].stories.length).toEqual(3);
        expect(changedIterations[1].stories.includes(stories[0])).toBeTruthy();
        expect(changedIterations[1].stories.includes(stories[1])).toBeTruthy();
        expect(changedIterations[1].stories.includes(stories[2])).toBeTruthy();
      });

      it('return iteration 0 with 1 stories', () => {
        expect(changedIterations[0].stories.length).toEqual(1);
        expect(changedIterations[0].stories.includes(stories[3])).toBeTruthy();
      });
    });
  });
});
