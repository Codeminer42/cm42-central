import actionTypes from 'actions/actionTypes';
import * as Story from 'models/beta/story';
import _ from 'underscore';

const initialState = {
  stories: [],
};

const filterByState = state => story => {
  return story.state === state;
}

const orderByState = (stories) => {
  const ordered = [...stories];

  ordered.sort(Story.comparePosition);

  const acceptedStories = ordered
                            .filter(filterByState('accepted'))
                            .sort(Story.compareAcceptedAt);

  const deliveredStories = ordered
                             .filter(filterByState('delivered'))
                             .sort(Story.compareDeliveredAt);

  const startedStories = ordered
                           .filter(filterByState('started'))
                           .sort(Story.compareStartedAt);

  const rejectedStories = ordered.filter(filterByState('rejected'));
  const finishedStories = ordered.filter(filterByState('finished'));
  const unstartedStories = ordered.filter(filterByState('unstarted'));

  const partitionedFeatures = _.partition(unstartedStories, Story.isUnestimatedFeature);
  const unestimatedUnstartedStories = partitionedFeatures[0];
  const estimatedUnstartedStories = partitionedFeatures[1];

  return [
    ...acceptedStories,
    ...deliveredStories,
    ...rejectedStories,
    ...finishedStories,
    ...startedStories,
    ...estimatedUnstartedStories,
    ...unestimatedUnstartedStories
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
