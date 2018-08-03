import actionTypes from 'actions/actionTypes';

const initialState = {
  stories: [],
};

const filterByState = state => story => {
  return story.state === state;
}


const orderByState = (stories) => {
  const ordered = [...stories];

  ordered.sort((a, b) => {
    return parseFloat(a.position) - parseFloat(b.position);
  });

  const acceptedStories = ordered.filter(filterByState('accepted'));
  const deliveredStories = ordered.filter(filterByState('delivered'));
  const rejectedStories = ordered.filter(filterByState('rejected'));
  const finishedStories = ordered.filter(filterByState('finished'));
  const startedStories = ordered.filter(filterByState('started'));
  const unstartedStories = ordered.filter(filterByState('unstarted'));

  return [
    ...acceptedStories,
    ...deliveredStories,
    ...rejectedStories,
    ...finishedStories,
    ...startedStories,
    ...unstartedStories
  ];
}

const backlog = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COLUMN_BACKLOG:
      const stories = [
        ...state.stories,
        action.data
      ];

      return {
        stories: orderByState(stories)
      }
    default:
      return state;
  }
};

export default backlog;
