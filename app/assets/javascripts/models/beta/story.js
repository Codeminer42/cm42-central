import { status, storyTypes } from "libs/beta/constants";
import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import * as Label from './label';
import PropTypes from 'prop-types';
import { notePropTypesShape } from './note';
import { taskPropTypesShape } from './task';
import { attachmentPropTypesShape } from './attachment';
import moment from 'moment';

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
  return (story.estimate === null || story.estimate === '') && story.storyType === storyTypes.FEATURE;
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

export const getPoints = story =>
  isFeature(story)
    ? Number(story.estimate)
    : 0;

export const getCompletedPoints = story => {
  return isFeature(story) && isAccepted(story) ? story.estimate : 0;
};

export const isStoryNotEstimated = (storyType, estimate) => storyType === 'feature' && !estimate;

export const isRelease = (story) =>
  story.storyType === storyTypes.RELEASE;

export const releaseIsLate = (story) => {
  if (!isRelease(story)) {
    return false;
  }

  const today = moment();
  const releaseDate = moment(story.releaseDate, ["YYYY-MM-DD"]).endOf('day');

  return today > releaseDate;
}

export const types = ['feature', 'bug', 'release', 'chore'];

export const states = [
  'unscheduled', 'unstarted', 'started',
  'finished', 'delivered', 'accepted',
  'rejected'
];

export const update = async (story, projectId, options) => {
  const newStory = serialize(story);

  const { data } = await httpService
    .put(`/projects/${projectId}/stories/${story.id}`, { story: newStory });

  return deserialize(data.story, options);
};

export const post = async (story, projectId) => {
  const newStory = serialize(story);

  const { data } = await httpService
    .post(`/projects/${projectId}/stories`, { story: newStory });

  return deserialize(data.story);
};

export const deleteStory = (storyId, projectId) =>
  httpService
    .delete(`/projects/${projectId}/stories/${storyId}`);

export const updateStory = (story, newAttributes) => ({
  ...story,
  ...newAttributes
});

export const storyFailure = (story, error) => ({
  ...story,
  _editing: setLoadingValue(story._editing, false),
  errors: error
});

export const toggleStory = (story) => {
  const editing = story.collapsed ? { ...story, _isDirty: false, loading: false } : null;

  return {
    ...story,
    _editing: editing,
    collapsed: !story.collapsed
  };
};

const stateFor = (story) => {
  if (story.state === "unscheduled" && typeof story.estimate === "number") return "unstarted";
  if (story.state === "unstarted" && isUnestimatedFeature(story)) return "unscheduled";
  if (!isFeature(story) && story.state === "unscheduled") return "unstarted";
  return story.state;
}

export const editStory = (story, newAttributes) => {
  const newStory = {
    ...story._editing,
    ...newAttributes
  };

  newStory.estimate = isFeature(newStory) ? newStory.estimate : '';
  newStory.labels = Label.uniqueLabels(newStory.labels);

  newStory.state = stateFor(newStory);

  return {
    ...story,
    _editing: {
      ...newStory,
      _isDirty: true
    }
  };
};

export const serialize = (story) => {
  const data = !isRelease(story)
    ? {
      ...story,
      labels: Label.joinLabels(story.labels)
    }
    : {
      ...story,
      estimate: '',
      ownedById: null,
      labels: '',
      ownedByName: null,
      ownedByInitials: null,
      notes: [],
      documents: [],
      tasks: [],
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

export const cloneStory = (story) => {
  const clonedStory = {
    ...story,
    id: null,
    state: status.UNSCHEDULED,
    _isDirty: true,
    collapsed: false,
    tasks: [],
    notes: [],
    documents: [],
    _editing: null
  }

  return {
    ...clonedStory,
    _editing: clonedStory
  }
}

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

export const canEdit = (story) =>
  !isAccepted(story)

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

export const storyTransitions = {
  START: 'start',
  FINISH: 'finish',
  DELIVER: 'deliver',
  ACCEPT: 'accept',
  REJECT: 'reject',
  RESTART: 'restart',
  RELEASE: 'release'
};

const stateTransitions = {
  [status.UNSCHEDULED]: {
    [storyTransitions.START]: status.STARTED
  },
  [status.UNSTARTED]: {
    [storyTransitions.START]: status.STARTED
  },
  [status.STARTED]: {
    [storyTransitions.FINISH]: status.FINISHED
  },
  [status.FINISHED]: {
    [storyTransitions.DELIVER]: status.DELIVERED
  },
  [status.DELIVERED]: {
    [storyTransitions.ACCEPT]: status.ACCEPTED,
    [storyTransitions.REJECT]: status.REJECTED
  },
  [status.REJECTED]: {
    [storyTransitions.RESTART]: status.STARTED
  },
  [status.ACCEPTED]: {}
};

export const getNextState = (currentState, transition) => {
  if (transition === storyTransitions.RELEASE) {
    return status.ACCEPTED
  }

  const nextState = stateTransitions[currentState][transition];

  if (nextState) {
    return nextState;
  }

  return currentState;
}

export const storyPropTypesShape = PropTypes.shape(storyPropTypes).isRequired;

export const editingStoryPropTypesShape = PropTypes.shape({
  ...storyPropTypes,
  _editing: storyPropTypesShape
});

const storyPropTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  estimate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  storyType: PropTypes.string,
  state: PropTypes.string,
  acceptedAt: PropTypes.string,
  requestedById: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  ownedById: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  projectId: PropTypes.number,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  position: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  labels: PropTypes.array,
  requestedByName: PropTypes.string,
  ownedByName: PropTypes.string,
  ownedByInitials: PropTypes.string,
  releaseDate: PropTypes.string,
  deliveredAt: PropTypes.string,
  errors: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  notes: PropTypes.arrayOf(notePropTypesShape.isRequired),
  documents: PropTypes.arrayOf(attachmentPropTypesShape.isRequired),
  tasks: PropTypes.arrayOf(taskPropTypesShape.isRequired),
};
