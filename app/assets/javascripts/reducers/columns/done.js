import actionTypes from 'actions/actionTypes';
import * as Story from 'models/beta/story';

const initialState = {
  stories: [],
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

      return { stories: orderByAcceptedAt(stories) }

    default:
      return state;
  }
};

export default done;
