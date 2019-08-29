import actionsTypes from '../../../app/assets/javascripts/actions/actionTypes';
import reducer from '../../../app/assets/javascripts/reducers/history';
import history from '../support/factories/historyFactory';

describe('History Reducer', () => {
  let expectedState;
  beforeEach(() => {
    expectedState = {
      status: 'DISABLED',
      activities: null,
      storyTitle: null
    };
  });

  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(expectedState);
  });

  it('should return a state with storyTitle', () => {
    expectedState.status = 'LOADING';
    expectedState.storyTitle = 'title';

    const action = {
      type: actionsTypes.LOAD_HISTORY,
      title: 'title'
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should add activities to history', () => {
    expectedState.status = 'LOADED';
    expectedState.activities = history();

    const action = {
      type: actionsTypes.RECEIVE_HISTORY,
      activities: history()
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('shoud return initial state when close history', () => {
    const action = {
      type: actionsTypes.CLOSE_HISTORY
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should change the history status to failed', () => {
    expectedState.status = 'FAILED';
    const action = {
      type: actionsTypes.RECEIVE_HISTORY_ERROR
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });
});
