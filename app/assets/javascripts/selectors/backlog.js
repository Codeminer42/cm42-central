import * as Story from '../models/beta/story';
import { status } from 'libs/beta/constants';
import _ from 'underscore';
import * as Iteration from 'models/beta/iteration';

export const orderByState = stories => {
  const ordered = [...stories];
  ordered.sort(Story.comparePosition);

  const acceptedStories = sortAcceptedStories(ordered);
  const deliveredStories = sortDeliveredStories(ordered);
  const startedStories = sortStartedStories(ordered);
  const rejectedStories = ordered.filter(filterByState(status.REJECTED));
  const finishedStories = ordered.filter(filterByState(status.FINISHED));
  const unstartedStories = ordered.filter(filterByState(status.UNSTARTED));

  return [
    ...acceptedStories,
    ...deliveredStories,
    ...rejectedStories,
    ...finishedStories,
    ...startedStories,
    ...unstartedStories,
  ];
};

const filterByState = state => story => {
  return story.state === state;
};

const sortAcceptedStories = stories => {
  return stories
    .filter(filterByState(status.ACCEPTED))
    .sort(Story.compareAcceptedAt);
};

const sortDeliveredStories = stories => {
  return stories
    .filter(filterByState(status.DELIVERED))
    .sort(Story.compareDeliveredAt);
};

const sortStartedStories = stories => {
  return stories
    .filter(filterByState(status.STARTED))
    .sort(Story.compareStartedAt);
};

export const groupStoriesInSprints = (stories, project, initialSprintNumber) =>
  Iteration.groupBySprints(stories, project, initialSprintNumber);

export const getSprintVelocity = (project, pastIterations) =>
  Iteration.sprintVelocity(project, pastIterations);
