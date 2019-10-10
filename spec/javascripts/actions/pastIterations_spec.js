import * as PastIterations from 'actions/pastIterations';
import actionTypes from 'actions/actionTypes';
import moment from 'moment';

describe('Past iteration actions', () => {
  const currentSprintDate = moment();
  const previousSprintDate = moment().subtract(1, 'weeks');
  const pastIterationsArray = overrides => [
    {
      iterationNumber: 42,
      startDate: previousSprintDate.format("YYYY/MM/DD"),
      endDate: currentSprintDate.format("YYYY/MM/DD"),
      stories: [41, 42, 43],
      ...overrides
    }
  ];

  describe('receivePastIterations', () => {
    const expected = {
      type: actionTypes.RECEIVE_PAST_ITERATIONS,
      data: pastIterationsArray()
    }

    it('creates an action to receive past iterations', () => {
      const created = PastIterations.receivePastIterations(pastIterationsArray());
      expect(created).toEqual(expected);
    });
  });

  describe('requestPastStories', () => {
    const expected = {
      type: actionTypes.REQUEST_PAST_STORIES,
      iterationNumber: 42
    }

    it('creates an action to request past iteration stories', () => {
      const created = PastIterations.requestPastStories(42);
      expect(created).toEqual(expected);
    });
  });

  describe('receivePastStories', () => {
    const expected = {
      type: actionTypes.RECEIVE_PAST_STORIES,
      stories: pastIterationsArray(),
      iterationNumber: 42,
      from: undefined
    }

    it('creates an action to receive past iteration stories', () => {
      const created = PastIterations.receivePastStories(pastIterationsArray(), 42);
      expect(created).toEqual(expected);
    });
  });

  describe('errorRequestPastStories', () => {
    const expected = {
      type: actionTypes.ERROR_REQUEST_PAST_STORIES,
      iterationNumber: 42,
      error: '404'
    }

    it('creates an action to receive past iteration stories', () => {
      const created = PastIterations.errorRequestPastStories('404', 42);
      expect(created).toEqual(expected);
    });
  });

  describe('requestStories', () => {
    const project = { id: 41 };
    const stories = [{ id: 41 }, { id: 42 }, { id: 43 }];
    const pastIterations = pastIterationsArray();
    const { iterationNumber, startDate, endDate } = pastIterations[0];
    let PastIteration;
    beforeEach(() => {
      PastIteration = {
        getStories: sinon.stub().returns(stories)
      }
    });

    it('calls dispatch with requestPastSotires', async () => {
      const getState = sinon.stub();
      getState.returns({ project, pastIterations });
      const dispatch = sinon.stub().resolves({});

      await PastIterations.fetchPastStories(iterationNumber)
        (dispatch, getState, { PastIteration });

      expect(dispatch).toHaveBeenCalledWith(PastIterations.requestPastStories(iterationNumber));
    });

    it('tries to fetch iteration stories', async () => {
      const getState = sinon.stub();
      getState.returns({ project, pastIterations });
      const dispatch = sinon.stub().resolves({});

      await PastIterations.fetchPastStories(iterationNumber, startDate, endDate)
        (dispatch, getState, { PastIteration });

      expect(PastIteration.getStories).toHaveBeenCalledWith(project.id, startDate, endDate);
    });

    describe('when request to get stories is sucessful', () => {
      it('calls dispatch with receivePastStories', async () => {
        const getState = sinon.stub();
        getState.returns({ project, pastIterations });
        const dispatch = sinon.stub().resolves({});

        await PastIterations.fetchPastStories(iterationNumber, startDate, endDate)
          (dispatch, getState, { PastIteration });

        expect(dispatch).toHaveBeenCalledWith(
          PastIterations.receivePastStories(stories, iterationNumber)
        );
      })
    });

    describe('when request to get stories throws error', () => {
      const error = Error('whoopsie');
      const PastIterationError = {
        getStories: async () => {
          throw error;
        }
      }

      it('calls dispatch with errorRequestPastStories', async () => {
        const getState = sinon.stub();
        getState.returns({ project, pastIterations });
        const dispatch = sinon.stub().resolves({});

        await PastIterations.fetchPastStories(iterationNumber, startDate, endDate)
          (dispatch, getState, { PastIteration: PastIterationError });

        expect(dispatch).toHaveBeenCalledWith(
          PastIterations.errorRequestPastStories(error, iterationNumber)
        );
      })
    });
  });
});
