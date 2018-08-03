import actionTypes from 'actions/actionTypes';

const initialState = {
  stories: [],
};

const orderByAcceptedAt = (stories) => {
  const orderedItems = [...stories];

  orderedItems.sort(function(a,b){
    return new Date(a.acceptedAt) - new Date(b.acceptedAt);
  });

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
