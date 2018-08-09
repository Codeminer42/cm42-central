import actionTypes from 'actions/actionTypes';
import * as Story from 'models/beta/story';

const initialState = {
  stories: [],
};

const orderByPosition = (items) => {
  const orderedItems = [...items];

  orderedItems.sort(Story.comparePosition);

  return orderedItems;
}


const chillyBin = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COLUMN_CHILLY_BIN:
      const stories = [
        ...state.stories,
        action.data,
      ];

      return { stories: orderByPosition(stories) }
    default:
      return state;
  }
};

export default chillyBin;
