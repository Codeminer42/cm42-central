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
    let state
    beforeEach(() => {
      state = [
        { id: 1 },
        { id: 2 }
      ];
    })
    it('adds a notification to the state',() => {
      const action = {
        type: actionsTypes.ADD_NOTIFICATION,
        notification: { id: 3 }
      };

      expect(reducer(state, action)).toEqual([{ id: 3 }, { id: 1 }, { id: 2 }]);
    });

    it('adds multiple notifications to the state',() => {
      const state = [
        { id: 1 },
        { id: 2 }
      ];

      const action = {
        type: actionsTypes.ADD_NOTIFICATION,
        notification: [{ id: 3 }, { id: 4 }, { id: 5 }]
      };

      expect(reducer(state, action)).toEqual([{ id: 3 }, { id: 4 }, { id: 5 }, { id: 1 }, { id: 2 }]);
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

      expect(reducer(state, action)).toEqual([{ id: 1 }, { id: 3 }]);
    })
  });
})
