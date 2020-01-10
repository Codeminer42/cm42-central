import actionsTypes from "../../../app/assets/javascripts/actions/actionTypes";
import reducer from "../../../app/assets/javascripts/reducers/project";

describe("Project Reducer",() => {
  describe("RECEIVE_PROJECT",() => {
    it("returns data from action",() => {
      const state = {};

      const action = {
        type: actionsTypes.RECEIVE_PROJECT,
        data: { id: 1 }
      };

      expect(reducer(state, action)).toEqual(action.data);
    });
  });

  describe("ADD_LABEL_TO_PROJECT",() => {
    it("adds new label to labels",() => {
      const state = { labels: [] };

      const action = {
        type: actionsTypes.ADD_LABEL_TO_PROJECT,
        label: { name: "label" }
      };

      expect(reducer(state, action)).toEqual({ labels: [{ name: "label"}]});
    });
  });

  describe("DEFAULT",() => {
    it("returns the initialState",() => {
      expect(reducer(undefined, {})).toEqual({});
    });
  });
});
