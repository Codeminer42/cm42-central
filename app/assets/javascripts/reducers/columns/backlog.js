import actionTypes from "actions/actionTypes";
import { status } from "libs/beta/constants";
import * as Story from "models/beta/story";
import _ from "underscore";
import * as Iteration from "models/beta/iteration";

const initialState = {
  stories: [],
  sprints: [],
};

const filterByState = state => story => {
  return story.state === state;
};

const orderByState = stories => {
  const ordered = [...stories];

  ordered.sort(Story.comparePosition);

  const acceptedStories = ordered
    .filter(filterByState(status.ACCEPTED))
    .sort(Story.compareAcceptedAt);

  const deliveredStories = ordered
    .filter(filterByState(status.DELIVERED))
    .sort(Story.compareDeliveredAt);

  const startedStories = ordered
    .filter(filterByState(status.STARTED))
    .sort(Story.compareStartedAt);

  const rejectedStories = ordered.filter(filterByState(status.REJECTED));
  const finishedStories = ordered.filter(filterByState(status.FINISHED));
  const unstartedStories = ordered.filter(filterByState(status.UNSTARTED));

  const partitionedFeatures = _.partition(
    unstartedStories,
    Story.isUnestimatedFeature
  );
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
};

const groupStoriesInSprints = (stories, project) => {
  const currentSprintNumber = Iteration.getCurrentIteration(project) || 0;

  return Iteration.groupBySprints(
    stories,
    project,
    currentSprintNumber
  );
};

const backlog = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COLUMN_BACKLOG:
      const stories = [...state.stories, action.data];
      const orderedStories = orderByState(stories);
      return {
        stories: orderedStories,
        sprints: groupStoriesInSprints(orderedStories, action.project)
      };
    default:
      return state;
  }
};

export default backlog;
