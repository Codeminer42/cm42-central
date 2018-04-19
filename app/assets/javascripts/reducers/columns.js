import actionTypes from 'actions/actionTypes';

const initialState = {
  chilly_bin: {
    stories: [],
  },
  backlog: {
    stories: [],
  },
  in_progress: {
    stories: [],
  },
  done: {
    stories: [],
  },
};

const columns = (state = initialState, action) => {
  switch(action.type) {
    default:
      return state;
  }
};

export default columns;
