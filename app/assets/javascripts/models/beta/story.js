import { status, storyTypes } from "libs/beta/constants";
import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import * as Label from './label';

const compareValues = (a, b) => {
  if (a > b) return 1;

  if (a < b) return -1;

  return 0;
};

export const comparePosition = (a, b) => {
  const positionA = parseFloat(a.position);
  const positionB = parseFloat(b.position);

  return compareValues(positionA, positionB);
};

export const compareAcceptedAt = (a, b) => {
  return compareValues(a.acceptedAt, b.acceptedAt);
};

export const compareDeliveredAt = (a, b) => {
  return compareValues(a.deliveredAt, b.deliveredAt);
};

export const compareStartedAt = (a, b) => {
  return compareValues(a.startedAt, b.startedAt);
};

export const isUnestimatedFeature = story => {
  return story.estimate === null && story.storyType === storyTypes.FEATURE;
};

export const isFeature = story => {
  return story.storyType === storyTypes.FEATURE;
};

export const isUnscheduled = story => {
  return story.state === status.UNSCHEDULED;
};

export const isUnstarted = story => {
  return story.state === status.UNSTARTED;
};

export const isAccepted = story => {
  return story.state === status.ACCEPTED;
};

export const getPoints = story => {
  return isFeature(story) ? story.estimate : 0;
};

export const getCompletedPoints = story => {
  return isFeature(story) && isAccepted(story) ? story.estimate : 0;
};

export const isStoryNotEstimated = (storyType, estimate) => storyType === 'feature' && !estimate;

export const isRelease = (storyType) => storyType === 'release';

export const types = ['feature', 'bug', 'release', 'chore'];

export const states = [
  'unscheduled', 'unstarted', 'started',
  'finished', 'delivered', 'accepted',
  'rejected'
];

export const update = (story, projectId, options) => {
  const newStory = serialize(story);

  return httpService
    .put(`/projects/${projectId}/stories/${story.id}`, { story: newStory })
    .then(({ data }) => deserialize(data.story, options));
};

export const post = (story, projectId) => {
  const newStory = serialize(story);

  return httpService
    .post(`/projects/${projectId}/stories`, { story: newStory })
    .then(({ data }) => deserialize(data.story));
};

export const deleteStory = (storyId, projectId) => {
  return httpService
    .delete(`/projects/${projectId}/stories/${storyId}`)
};

export const updateStory = (story, newAttributes) => {
  return {
    ...story,
    ...newAttributes
  };
};

export const storyFailure = (story, error) => {
  const errors = error ? [
    ...story.errors,
    error
  ] : story.errors;

  return {
    ...story,
    _editing: setLoadingValue(story._editing, false),
    errors
  };
};

export const toggleStory = (story) => {
  const editing = story.collapsed ? { ...story, _isDirty: false, loading: false } : null;

  return {
    ...story,
    _editing: editing,
    collapsed: !story.collapsed
  };
};

export const editStory = (story, newAttributes) => {
  const newStory = {
    ...story._editing,
    ...newAttributes
  };

  newStory.estimate = isFeature(newStory) ? newStory.estimate : '';
  newStory.labels = Label.uniqueLabels(newStory.labels);

  return {
    ...story,
    _editing: {
      ...newStory,
      _isDirty: true
    }
  };
};

export const serialize = (story) => {
  const data = {
    ...story,
    labels: Label.joinLabels(story.labels)
  };

  return changeCase.snakeKeys(data, {
    recursive: true,
    arrayRecursive: true
  });
};

export const deserialize = (data, options) => {
  const story = changeCase.camelKeys(data, {
    recursive: true,
    arrayRecursive: true
  });

  options = options || {};
  const collapsed = options.collapse == undefined ? true : options.collapse;

  return {
    ...story,
    labels: Label.splitLabels(story.labels),
    estimate: story.estimate || '',
    documents: story.documents.map(document => document.file),
    collapsed
  };
};

export const setLoadingStory = (story) => ({
  ...story,
  _editing: setLoadingValue(story._editing, true)
});

export const setLoadingValue = (story, loading) => ({
  ...story,
  loading
});

export const createNewStory = (stories, storyAttributes) => {
  const story = stories.find(isNew);

  if (story) {
    return {
      ...story,
      ...storyAttributes
    };
  }

  const newStory = {
    ...emptyStory,
    ...storyAttributes,
    collapsed: false
  }

  return {
    ...newStory,
    _editing: newStory
  };
};

export const isNew = (story) =>
  story.id === null;

export const canSave = (story) =>
  !isAccepted(story) && story._editing.title !== "";

export const canDelete = (story) =>
  !isAccepted(story) && !isNew(story);

export const withoutNewStory = (stories) =>
  stories.filter(story => !isNew(story));

export const replaceOrAddNewStory = (stories, newStory) => {
  if (shouldReplace(stories)) {
    return stories.map(story =>
      isNew(story) ? newStory : story
    );
  }

  return [newStory, ...stories];
}

const shouldReplace = (stories) =>
  stories.some(isNew);

const emptyStory = {
  id: null,
  title: '',
  description: null,
  estimate: '',
  storyType: 'feature',
  state: 'unscheduled',
  acceptedAt: null,
  requestedById: null,
  ownedById: null,
  projectId: null,
  createdAt: '',
  updatedAt: '',
  position: '',
  labels: [],
  requestedByName: '',
  ownedByName: null,
  ownedByInitials: null,
  releaseDate: null,
  deliveredAt: null,
  errors: {},
  notes: [],
  documents: [],
  tasks: [],
};
