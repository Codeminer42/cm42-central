import actionsTypes from "../../../app/assets/javascripts/actions/actionTypes";
import reducer from "../../../app/assets/javascripts/reducers/history";
import history from "../support/factories/historyFactory";
import createState from "../support/factories/stateHistoryFactory";

describe("History Reducer", () => {
  it("should return initialState", () => {
    expect(reducer(undefined, {})).toEqual(createState());
  });

  it("should return a state with storyTitle", () => {
    const state = {
      status: "LOADING",
      storyTitle: "title"
    };

    const action = {
      type: actionsTypes.LOAD_HISTORY,
      title: "title"
    };

    expect(reducer(undefined, action)).toEqual(createState({ ...state }));
  });

  it("should add activities to history", () => {
    const state = {
      status: "LOADED",
      activities: history()
    };

    const action = {
      type: actionsTypes.RECEIVE_HISTORY,
      activities: history()
    };

    expect(reducer(undefined, action)).toEqual(createState({ ...state }));
  });

  it("shoud return initial state when close history", () => {
    const action = {
      type: actionsTypes.CLOSE_HISTORY
    };

    expect(reducer(undefined, action)).toEqual(createState());
  });

  it("should change the history status to failed", () => {
    const state = {
      status: "FAILED"
    };
    const action = {
      type: actionsTypes.RECEIVE_HISTORY_ERROR
    };

    expect(reducer(undefined, action)).toEqual(createState({ ...state }));
  });
});
