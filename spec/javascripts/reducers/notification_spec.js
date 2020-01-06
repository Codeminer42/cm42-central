import actionsTypes from "../../../app/assets/javascripts/actions/actionTypes";
import reducer from "../../../app/assets/javascripts/reducers/notifications";

describe("Notification Reducer",() => {
  describe("DEFAULT", () => {
    it("return the initialState", () => {
      const initialState = [];
      expect(reducer(undefined, initialState)).toEqual([]);
    });
  })

describe('ADD_NOTIFICATION', () => {
    it('adds a notification to the state',() => {
      const state = [
        { id: 1 },
        { id: 2 }
      ];

      const action = {
        type: actionsTypes.ADD_NOTIFICATION,
        notification: { id: 3 }
      };

      const expectedState = [
        { id: 3 },
        { id: 1 },
        { id: 2 }
      ];

      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe('REMOVE_NOTIFICATION', () => {
    it('removes a notification from the state', () => {
      const state = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ];

      const action = {
        type: actionsTypes.REMOVE_NOTIFICATION,
        id: 2
      };

      const expectedState = [{ id: 1 }, { id: 3 }];

      expect(reducer(state, action)).toEqual(expectedState);
    })
  });
})
