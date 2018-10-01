import actionTypes from 'actions/actionTypes';
import * as Story from 'models/beta/story';
import moment from "moment";

const initialState = {
  stories: [],
  sprints: [],
};

const orderByAcceptedAt = (stories) => {
  const orderedItems = [...stories];

  orderedItems.sort(Story.compareAcceptedAt);

  return orderedItems;
}

const done = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COLUMN_DONE:
      const stories = [
        ...state.stories,
        action.data,
      ];
     
      return { stories: orderByAcceptedAt(stories) };
    case actionTypes.RECEIVE_PROJECT:
      const sprints = action.data.pastIterations.map((sprint, index) => ({
        ...sprint,
        number: index + 1,
        startDate: moment(sprint.startDate).format("ddd MMM Do Y"),
        endDate: moment(sprint.endDate).format("ddd MMM Do Y"),
        stories: [],
      }));
    
      return { sprints };
    default:
      return state;
  }
};

export default done;
