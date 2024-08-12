import { status, storyTypes, storyScopes } from 'libs/beta/constants';
import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import * as Label from './label';
import PropTypes from 'prop-types';
import StoryPropTypesShape, {
  storyPropTypes,
} from '../../components/shapes/story';
import moment from 'moment';
import { has } from 'underscore';
import * as History from './history';

const compareValues = (a, b) => {
  if (a > b) return 1;

  if (a < b) return -1;

  return 0;
};

export const needConfirmation = story =>
  story.state === status.ACCEPTED ||
  story.state === status.REJECTED ||
  story.state === status.RELEASE;

export const comparePosition = (a, b) => {
  const positionA = Number(a.newPosition);
  const positionB = Number(b.newPosition);

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

export const isUnestimatedFeature = story =>
  !hasEstimate(story) && isFeature(story);

export const isInProgress = story =>
  !isUnscheduled(story) && !isUnstarted(story);

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

export const totalPoints = stories =>
  stories.reduce((total, current) => total + getPoints(current), 0);

export const isHighlighted = story => Boolean(story.highlighted);

export const getPoints = story =>
  isFeature(story) ? Number(story.estimate) : 0;

export const getCompletedPoints = story =>
  isFeature(story) && isAccepted(story) ? story.estimate : 0;

export const isSameState = (story1, story2) => story1.state === story2.state;

export const isStoryNotEstimated = (storyType, estimate) =>
  storyType === 'feature' && !estimate;

export const isRelease = story => story.storyType === storyTypes.RELEASE;

export const hasHistory = story => !isRelease(story);

export const releaseIsLate = story => {
  if (!isRelease(story)) {
    return false;
  }

  const today = moment();
  const releaseDate = moment(story.releaseDate, ['YYYY-MM-DD']).endOf('day');

  return today > releaseDate;
};

export const possibleStatesFor = story =>
  isUnestimatedFeature(story._editing) ? [states[0]] : states;

export const types = ['feature', 'bug', 'release', 'chore'];

export const states = [
  'unscheduled',
  'unstarted',
  'started',
  'finished',
  'delivered',
  'accepted',
  'rejected',
];

export const findById = (stories, id) => {
  return stories.find(story => story.id === id);
};

export const updatePosition = async story => {
  const serializedStory = serialize(story);

  const { data } = await httpService.post(
    `/beta/stories/${story.id}/position`,
    { story: serializedStory }
  );

  const deserializedData = data.map(item => deserialize(item.story));

  return deserializedData;
};

export const update = async (story, projectId, options) => {
  const serializedStory = serialize(story);

  const { data } = await httpService.put(
    `/projects/${projectId}/stories/${story.id}`,
    { story: serializedStory }
  );

  return deserialize(data.story, options);
};

export const getHighestNewPosition = stories => {
  if (stories.length === 1) {
    return 1;
  }
  const storiesNewPosition = stories.map(story => story.newPosition);
  const highestPositionValue = Math.max(...storiesNewPosition);

  return highestPositionValue + 1;
};

export const post = async (story, projectId) => {
  const serializedStory = serialize(story);

  const { data } = await httpService.post(`/projects/${projectId}/stories`, {
    story: serializedStory,
  });

  return deserialize(data.story);
};

export const deleteStory = (storyId, projectId) =>
  httpService.delete(`/projects/${projectId}/stories/${storyId}`);

export const addNewAttributes = (current, newAttributes) => {
  return { ...current, ...newAttributes };
};

export const search = async (queryParam, projectId) => {
  const { data } = await httpService.get(
    `/projects/${projectId}/stories?q=${queryParam}`,
    {
      timeout: 1500,
    }
  );
  return data.map(item => deserialize(item.story));
};

export const getByLabel = async (label, projectId) => {
  const { data } = await httpService.get(
    `/projects/${projectId}/stories?label=${label}`,
    {
      timeout: 1500,
    }
  );
  return data.map(item => deserialize(item.story));
};

export const getHistory = async (storyId, projectId, users) => {
  const { data } = await httpService.get(
    `/projects/${projectId}/stories/${storyId}/activities`
  );
  return History.deserializeHistory(data, users);
};

export const storyFailure = (story, error) => ({
  ...story,
  _editing: setLoadingValue(story._editing, false),
  errors: error,
  needsToSave: false,
});

export const toggleStory = story => {
  const editing = story.collapsed
    ? { ...story, _isDirty: false, loading: false }
    : null;

  return {
    ...story,
    _editing: editing,
    collapsed: !story.collapsed,
  };
};

const isUnscheduledState = (story, newAttributes) =>
  isFeature(story._editing) &&
  (isChangingWithoutEstimate(story, newAttributes) ||
    hasNilProp(newAttributes, 'estimate') ||
    isChangingToUnscheduled(story, newAttributes) ||
    isUnscheduled(newAttributes));

const hasNilProp = (story, prop) => has(story, prop) && !story[prop];

const isChangingToUnscheduled = (story, newAttributes) =>
  isUnscheduled(story._editing) &&
  !has(newAttributes, 'state') &&
  !hasEstimate(newAttributes);

const isChangingWithoutEstimate = (story, newAttributes) =>
  !hasEstimate(story._editing) && !hasEstimate(newAttributes);

export const stateFor = (story, newAttributes, newStory) =>
  isUnscheduledState(story, newAttributes)
    ? status.UNSCHEDULED
    : newStory.state;

export const estimateFor = (story, newAttributes, newStory) => {
  if (isNoEstimated(story, newAttributes)) return '';
  if (isFeature(newAttributes) && !isUnscheduled(story._editing)) return 1;

  return newStory.estimate;
};

const isEstimable = isFeature;

const isNoEstimated = (story, newAttributes) =>
  (!isEstimable(story._editing) && !has(newAttributes, 'storyType')) ||
  (!isEstimable(newAttributes) && has(newAttributes, 'storyType'));

const hasEstimate = story => Boolean(story.estimate);

export const editStory = (story, newAttributes) => {
  const newStory = {
    ...story._editing,
    ...newAttributes,
  };

  newStory.state = stateFor(story, newAttributes, newStory);
  newStory.estimate = estimateFor(story, newAttributes, newStory);
  newStory.labels = Label.uniqueLabels(newStory.labels);

  return {
    ...story,
    _editing: {
      ...newStory,
      _isDirty: true,
    },
  };
};

export const serialize = story => {
  const data = !isRelease(story)
    ? {
        ...story,
        labels: Label.joinLabels(story.labels),
      }
    : {
        ...story,
        estimate: '',
        ownedById: null,
        labels: '',
        ownedByName: null,
        ownedByInitials: null,
        notes: [],
        tasks: [],
      };

  return changeCase.snakeKeys(data, {
    recursive: true,
    arrayRecursive: true,
  });
};

export const deserialize = (data, options) => {
  const story = changeCase.camelKeys(data, {
    recursive: true,
    arrayRecursive: true,
  });

  options = options || {};
  const collapsed = options.collapse === undefined ? true : options.collapse;

  return {
    ...story,
    labels: Label.splitLabels(story.labels),
    estimate: story.estimate || '',
    collapsed,
  };
};

export const setLoadingStory = story => ({
  ...story,
  _editing: setLoadingValue(story._editing, true),
});

export const setLoadingValue = (story, loading) => ({
  ...story,
  loading,
});

export const cloneStory = story => {
  const clonedStory = {
    ...story,
    id: null,
    state: status.UNSCHEDULED,
    _isDirty: true,
    collapsed: false,
    tasks: [],
    notes: [],
    _editing: null,
  };

  return {
    ...clonedStory,
    _editing: clonedStory,
  };
};

export const createNewStory = (stories, storyAttributes) => {
  const story = stories.find(isNew);

  if (story) {
    editStory(story, storyAttributes);
  }

  const newId = createTemporaryId();

  const newStory = {
    ...emptyStory,
    ...storyAttributes,
    collapsed: false,
    id: newId,
  };

  return {
    ...newStory,
    _editing: newStory,
  };
};

export const createTemporaryId = () => Symbol(`new-${Date.now()}`);

export const withScope = (stories, from) =>
  Boolean(from) ? stories[from] : stories[storyScopes.ALL];

export const isSearch = from => from === storyScopes.SEARCH;

export const isEpic = from => from === storyScopes.EPIC;

export const haveHighlightButton = (stories, story, from) =>
  (isEpic(from) || isSearch(from)) && haveStory(story, stories);

export const haveSearch = stories =>
  Boolean(stories[storyScopes.SEARCH].length);

export const haveStory = (story, stories) =>
  stories.some(item => item.id === story.id);

export const isNew = story => {
  return typeof story.id === 'symbol';
};

export const canSave = story =>
  !isAccepted(story) && story._editing.title !== '';

export const canDelete = story => !isAccepted(story) && !isNew(story);

export const canEdit = story => !isAccepted(story);

export const withoutNewStory = (stories, id) =>
  stories.filter(story => story.id !== id);

export const replaceOrAddNewStory = (stories, newStory, id) => {
  if (id) {
    return stories.map(story => (story.id === id ? newStory : story));
  }

  return [newStory, ...stories];
};

const emptyStory = {
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
  newPosition: null,
  labels: [],
  requestedByName: '',
  ownedByName: null,
  ownedByInitials: null,
  releaseDate: null,
  deliveredAt: null,
  errors: {},
  notes: [],
  tasks: [],
};

export const storyTransitions = {
  START: 'start',
  FINISH: 'finish',
  DELIVER: 'deliver',
  ACCEPT: 'accept',
  REJECT: 'reject',
  RESTART: 'restart',
  RELEASE: 'release',
};

const stateTransitions = {
  [status.UNSCHEDULED]: {
    [storyTransitions.START]: status.STARTED,
  },
  [status.UNSTARTED]: {
    [storyTransitions.START]: status.STARTED,
  },
  [status.STARTED]: {
    [storyTransitions.FINISH]: status.FINISHED,
  },
  [status.FINISHED]: {
    [storyTransitions.DELIVER]: status.DELIVERED,
  },
  [status.DELIVERED]: {
    [storyTransitions.ACCEPT]: status.ACCEPTED,
    [storyTransitions.REJECT]: status.REJECTED,
  },
  [status.REJECTED]: {
    [storyTransitions.RESTART]: status.STARTED,
  },
  [status.ACCEPTED]: {},
};

export const getNextState = (currentState, transition) => {
  if (transition === storyTransitions.RELEASE) {
    return status.ACCEPTED;
  }

  const nextState = stateTransitions[currentState][transition];

  if (nextState) {
    return nextState;
  }

  return currentState;
};

export const editingStoryPropTypesShape = PropTypes.shape({
  ...storyPropTypes,
  _editing: StoryPropTypesShape,
});

export const donePoints = stories =>
  stories.reduce((points, story) => getCompletedPoints(story) + points, 0);

export const remainingPoints = stories =>
  totalPoints(stories) - donePoints(stories);

export const sortOptimistically = (stories, newStory) => {
  const isChillyBinStory = isUnscheduled(newStory);
  const targetStories = stories.filter(
    story => isUnscheduled(story) === isChillyBinStory
  );

  const storiesToUpdate = targetStories.filter(
    story =>
      story.newPosition >= newStory.newPosition && story.id !== newStory.id
  );
  const updatedPositions = storiesToUpdate.map(story => ({
    ...story,
    newPosition: story.newPosition + 1,
  }));

  return [...updatedPositions, newStory];
};
