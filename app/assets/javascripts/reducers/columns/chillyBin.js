import actionTypes from 'actions/actionTypes';

const initialState = {
  stories: [],
};


const orderByPosition = (items) => {
  const orderedItems = [...items];

  orderedItems.sort((a, b) => {
    return parseFloat(a.position) - parseFloat(b.position)
  });

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
