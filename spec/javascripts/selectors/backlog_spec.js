import { orderByState } from '../../../app/assets/javascripts/selectors/backlog';
import storyFactory from '../support/factories/storyFactory';

describe('Backlog selector functions', () => {
  const storiesArray = [
    {
      id: 2,
      position: '4.5',
      state: 'rejected',
      estimate: 1,
    },
    {
      id: 1,
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
      position: '7.5',
      state: 'started',
      startedAt: '2018-08-06T16:36:20.811Z',
      estimate: 1,
    },
    {
      id: 5,
      position: '3.7',
      state: 'finished',
      estimate: 1,
    },
    {
      id: 6,
      position: '4.9',
      state: 'delivered',
      deliveredAt: '2018-08-06T16:36:20.811Z',
      estimate: 1,
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

  describe('when stories have the same state', () => {
    describe('Story state is accepted', () => {
      it('sort by acceptedAt', () => {
        const newStory = storyFactory({
          id: 0,
          state: 'accepted',
          acceptedAt: '2018-08-03T16:36:20.811Z'
        });

        const oldStory = storyFactory({
          id: 1,
          state: 'accepted',
          acceptedAt: '2018-08-02T16:36:20.811Z'
        });

        const stories = [newStory, oldStory];
        const orderedStories = orderByState(stories);
        
        expect(orderedStories[0]).toEqual(oldStory);
        expect(orderedStories[1]).toEqual(newStory);
      });
    });

    describe('Story state is delivered', () => {
      it('sort by deliveredAt', () => {
        const newStory = storyFactory({
          id: 0,
          state: 'delivered',
          deliveredAt: '2018-08-03T16:36:20.811Z'
        });

        const oldStory = storyFactory({
          id: 1,
          state: 'delivered',
          deliveredAt: '2018-08-02T16:36:20.811Z'
        });

        const stories = [newStory, oldStory];
        const orderedStories = orderByState(stories);
        
        expect(orderedStories[0]).toEqual(oldStory);
        expect(orderedStories[1]).toEqual(newStory);
      });
    });

    describe('Story state is started', () => {
      it('sort by startedAt', () => {
        const newStory = storyFactory({
          id: 0,
          state: 'started',
          startedAt: '2018-08-03T16:36:20.811Z'
        });

        const oldStory = storyFactory({
          id: 1,
          state: 'started',
          startedAt: '2018-08-02T16:36:20.811Z'
        });

        const stories = [newStory, oldStory];
        const orderedStories = orderByState(stories);
        
        expect(orderedStories[0]).toEqual(oldStory);
        expect(orderedStories[1]).toEqual(newStory);
      });
    });

    describe('Story state is rejected, finished, unstarted', () => {
      const storyStates = ['rejected', 'finished', 'unstarted'];
      
      it('sort by position', () => {
        storyStates.forEach(state => {
          const firstPosition = storyFactory({
            id: 1,
            position: '1',
            state,
          });

          const secondPosition = storyFactory({
            id: 0,
            position: '2',
            state,
          });
  
          const stories = [secondPosition, firstPosition];
          const orderedStories = orderByState(stories);
          
          expect(orderedStories[0]).toEqual(firstPosition);
          expect(orderedStories[1]).toEqual(secondPosition);
        });
      });
    });
  });
});
