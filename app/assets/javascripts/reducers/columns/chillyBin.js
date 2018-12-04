import actionTypes from 'actions/actionTypes';
import * as Story from 'models/beta/story';
import _ from 'underscore';

const initialState = {
  stories: [],
};

const orderByUnestimatedFeatures = (stories) => {
  const ordered = [...stories];

  ordered.sort(Story.comparePosition);

  const partitionedFeatures = _.partition(ordered, Story.isUnestimatedFeature);
  const unestimatedStories = partitionedFeatures[0];
  const estimatedStories = partitionedFeatures[1];

  return [
    ...estimatedStories,
    ...unestimatedStories
  ];
}

const chillyBin = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COLUMN_CHILLY_BIN:
      const stories = [
        ...state.stories,
        action.data,
      ];

      return { stories: orderByUnestimatedFeatures(stories) }
    default:
      return state;
  }
};

export default chillyBin;
