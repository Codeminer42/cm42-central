import actionTypes from 'actions/actionTypes';

const initialState = {
  stories: [],
};

const compareAccepted = (a, b ) => {
  if (a.acceptedAt > b.acceptedAt) return 1;

  if (a.acceptedAt < b.acceptedAt) return -1;

  return 0;
}

const orderByAcceptedAt = (stories) => {
  const orderedItems = [...stories];

  orderedItems.sort(compareAccepted);

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
