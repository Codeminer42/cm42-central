import { orderByState } from '../../../app/assets/javascripts/selectors/backlog';

describe('Backlog selector functions', () => {
  const storiesArray = [
    {
      id: 2,
      position: '4.5',
      state: 'rejected',
      estimate: 1,
      collapsed: true
    },
    {
      id: 1,
      position: '1.5',
      state: 'accepted',
      acceptedAt: '2018-08-06T16:36:20.811Z',
      estimate: 1,
      collapsed: true
    },
    {
      id: 3,
      position: '3.2',
      state: 'unstarted',
      estimate: 1,
      collapsed: true
    },
    {
      id: 4,
      position: '7.5',
      state: 'started',
      startedAt: '2018-08-06T16:36:20.811Z',
      estimate: 1,
      collapsed: true
    },
    {
      id: 5,
      position: '3.7',
      state: 'finished',
      estimate: 1,
      collapsed: true
    },
    {
      id: 6,
      position: '4.9',
      state: 'delivered',
      deliveredAt: '2018-08-06T16:36:20.811Z',
      estimate: 1,
      collapsed: true
    }
  ];

  describe('orderByState', () => {
    it("return stories ordered by state", () => {
      const stories = storiesArray;
      const orderedStories = orderByState(stories);

      expect(orderedStories[0].state).toEqual('accepted');
      expect(orderedStories[1].state).toEqual('delivered');
      expect(orderedStories[2].state).toEqual('rejected');
      expect(orderedStories[3].state).toEqual('finished');
      expect(orderedStories[4].state).toEqual('started');
      expect(orderedStories[5].state).toEqual('unstarted');
    });
  });
});
