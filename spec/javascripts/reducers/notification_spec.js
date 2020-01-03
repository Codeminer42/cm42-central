import actionsTypes from "../../../app/assets/javascripts/actions/actionTypes";
import reducer from "../../../app/assets/javascripts/reducers/notifications";

describe("Notification Reducer",() => {
  it("should return initialState", () => {
    expect(reducer(undefined, [])).toEqual([]);
  });
  it("should add notification to the state ", () => {
    const state = [
      { id: 1 },
      { id: 2 }
    ];

    const action = {
      type: actionsTypes.ADD_NOTIFICATION,
      notification: { id: 3 }
    };

    const expectedNotificationsState = [action.notification, ...state];

    expect(reducer(state, action)).toEqual(expectedNotificationsState);
  });
  it("should remove notification from the state", () => {
    const state = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];

    const expectedNotificationsArray = [{ id: 1 }, { id: 3 }];

    const action = {
      type: actionsTypes.REMOVE_NOTIFICATION,
      id: 2
    };
    expect(reducer(state, action)).toEqual(expectedNotificationsArray);
  });
})
