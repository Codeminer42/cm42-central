import actionTypes from 'actions/actionTypes';
import {
  toggleStory,
  editStory,
  addNewAttributes,
  setLoadingStory,
  setLoadingValue,
  cloneStory,
  storyFailure,
  withoutNewStory,
  createNewStory,
  replaceOrAddNewStory,
} from 'models/beta/story';
import * as Note from 'models/beta/note';
import * as Task from 'models/beta/task';
import * as Label from 'models/beta/label';
import { updateIfSameId } from '../services/updateIfSameId';
import { storyScopes } from './../libs/beta/constants';
import { isEpic, isSearch, isNew } from '../models/beta/story';

const initialState = {
  [storyScopes.ALL]: {},
  [storyScopes.SEARCH]: {},
  [storyScopes.EPIC]: {},
};

const storiesReducer = (state = initialState, action) => {
  const denormalizedStories = denormalizeStories(state[action.from]);

  switch (action.type) {
    case actionTypes.RECEIVE_STORIES: {
      const normalizedData = normalizeStories(action.data);

      if (isEpic(action.from) || isSearch(action.from)) {
        return {
          ...state,
          [action.from]: normalizedData,
        };
      }

      return {
        ...state,
        [action.from]: mergeWithFetchedStories(
          state[action.from],
          normalizedData
        ),
      };
    }
    case actionTypes.RECEIVE_PAST_STORIES:
      const normalizedPastStories = normalizeStories(action.stories);

      return {
        ...state,
        [action.from]: {
          stories: {
            byId: {
              ...state[action.from].stories.byId,
              ...normalizedPastStories.stories.byId,
            },
            allIds: [
              ...state[action.from].stories.allIds,
              ...normalizedPastStories.stories.allIds,
            ],
          },
        },
      };
    case actionTypes.CREATE_STORY:
      const newStory = createNewStory(denormalizedStories, action.attributes);

      return {
        ...state,
        [action.from]: normalizeStories(
          replaceOrAddNewStory(denormalizedStories, newStory)
        ),
      };
    case actionTypes.ADD_STORY:
      return {
        ...state,
        [action.from]: normalizeStories(
          replaceOrAddNewStory(
            denormalizedStories,
            action.story.story,
            action.story.id
          )
        ),
      };
    case actionTypes.CLONE_STORY:
      const clonedStory = cloneStory(action.story);

      return {
        ...state,
        [action.from]: normalizeStories(
          replaceOrAddNewStory(denormalizedStories, clonedStory)
        ),
      };
    case actionTypes.TOGGLE_STORY:
      if (isNew(action)) {
        return {
          ...state,
          [action.from]: normalizeStories(
            withoutNewStory(denormalizedStories, action.id)
          ),
        };
      }

      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(updateIfSameId(action.id, toggleStory))
        ),
      };
    case actionTypes.EDIT_STORY:
      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(
            updateIfSameId(action.id, story => {
              return editStory(story, action.newAttributes);
            })
          )
        ),
      };
    case actionTypes.UPDATE_STORY_SUCCESS:
      return normalizeAllScopes(
        allScopes(state, action.story.id, stories => {
          return stories.map(
            updateIfSameId(action.story.id, story =>
              addNewAttributes(story, {
                ...action.story,
                needsToSave: false,
                loading: false,
              })
            )
          );
        })
      );
    case actionTypes.SORT_STORIES:
      return normalizeAllScopes(
        allScopes(state, null, stories => {
          return stories.map(story => {
            const editingStory = action.stories.find(
              incomingStory => story.id === incomingStory.id
            );

            return editingStory
              ? addNewAttributes(story, {
                  ...editingStory,
                  needsToSave: false,
                  loading: false,
                })
              : story;
          });
        })
      );
    case actionTypes.STORY_FAILURE:
      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(
            updateIfSameId(action.id, story => {
              return storyFailure(story, action.error);
            })
          )
        ),
      };
    case actionTypes.SET_LOADING_STORY:
      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(updateIfSameId(action.id, setLoadingStory))
        ),
      };
    case actionTypes.ADD_TASK:
      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(
            updateIfSameId(action.storyId, story => {
              return Task.addTask(story, action.task);
            })
          )
        ),
      };
    case actionTypes.REMOVE_TASK:
      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(
            updateIfSameId(action.storyId, story => {
              return Task.deleteTask(action.task, story);
            })
          )
        ),
      };
    case actionTypes.TOGGLE_TASK:
      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(
            updateIfSameId(action.story.id, story => {
              return Task.toggleTask(story, action.task);
            })
          )
        ),
      };
    case actionTypes.DELETE_STORY_SUCCESS:
      return normalizeAllScopes(
        allScopes(state, action.id, stories => {
          return stories.filter(story => story.id !== action.id);
        })
      );
    case actionTypes.ADD_NOTE:
      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(
            updateIfSameId(action.storyId, story => {
              return Note.addNote(story, action.note);
            })
          )
        ),
      };
    case actionTypes.HIGHLIGHT_STORY:
      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(story => {
            return story.id === action.storyId
              ? { ...story, highlighted: action.highlighted }
              : story;
          })
        ),
      };
    case actionTypes.DELETE_NOTE:
      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(
            updateIfSameId(action.storyId, story => {
              return Note.deleteNote(story, action.noteId);
            })
          )
        ),
      };
    case actionTypes.ADD_LABEL:
      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(
            updateIfSameId(action.storyId, story => ({
              ...story,
              _editing: {
                ...story._editing,
                _isDirty: true,
                labels: Label.addLabel(story._editing.labels, action.label),
              },
            }))
          )
        ),
      };
    case actionTypes.DELETE_LABEL:
      return {
        ...state,
        [action.from]: normalizeStories(
          denormalizedStories.map(
            updateIfSameId(action.storyId, story => ({
              ...story,
              _editing: {
                ...story._editing,
                _isDirty: true,
                labels: Label.removeLabel(
                  story._editing.labels,
                  action.labelName
                ),
              },
            }))
          )
        ),
      };
    case actionTypes.CLOSE_EPIC_COLUMN:
      return {
        ...state,
        [storyScopes.EPIC]: [],
      };
    default:
      return state;
  }
};

const withScope = reducer => (state, action) => {
  const from = action.from || storyScopes.ALL;
  action = { ...action, from };

  return reducer(state, action);
};

const allScopes = (stories, storyId, mutation) => ({
  [storyScopes.ALL]: mutation(storiesWithScope(stories, storyScopes.ALL)),
  [storyScopes.SEARCH]: mutation(storiesWithScope(stories, storyScopes.SEARCH)),
  [storyScopes.EPIC]: mutation(storiesWithScope(stories, storyScopes.EPIC)),
});

const mergeWithFetchedStories = (currentStories, fetchedStories) => {
  if (Object.values(currentStories).length === 0) {
    const firstStoriesById = fetchedStories.stories.allIds.reduce(
      (acc, storyId) => {
        return {
          ...acc,
          [storyId]: {
            ...fetchedStories.stories.byId[storyId],
            serverBased: true,
          },
        };
      },
      {}
    );

    return {
      ...fetchedStories,
      stories: {
        ...fetchedStories.stories,
        byId: firstStoriesById,
        allIds: fetchedStories.stories.allIds,
      },
    };
  }

  const mergedStories = fetchedStories.stories.allIds.reduce(
    (acc, storyId) => {
      const currentStory = currentStories.stories.byId[storyId];
      const fetchedStory = fetchedStories.stories.byId[storyId];
      const isCollapsed = currentStory && !currentStory.collapsed;

      const updatedStory = { ...fetchedStory, serverBased: true };

      if (isCollapsed) {
        updatedStory.collapsed = false;
        updatedStory._editing = { ...currentStory._editing };
      }

      return {
        ...acc,
        stories: {
          ...acc.stories,
          byId: {
            ...acc.stories.byId,
            [storyId]: updatedStory,
          },
          allIds: currentStories.stories.allIds.includes(storyId)
            ? [...acc.stories.allIds]
            : [storyId, ...acc.stories.allIds],
        },
      };
    },
    { ...currentStories }
  );

  const updatedMergedStories = filterAndRemoveStories(
    mergedStories,
    fetchedStories
  );

  return updatedMergedStories;
};

const filterAndRemoveStories = (mergedStories, fetchedStories) => {
  const serverBasedIds = Object.values(mergedStories.stories.byId)
    .filter(story => story.serverBased)
    .map(story => story.id);

  const storiesToRemove = serverBasedIds.filter(
    id => !fetchedStories.stories.allIds.includes(id)
  );

  const updatedStoriesAllIds = mergedStories.stories.allIds.filter(
    storyId => !storiesToRemove.includes(storyId)
  );

  const updatedStoriesById = storiesToRemove.reduce(
    (acc, storyId) => {
      const { [storyId]: _, ...rest } = acc;
      return rest;
    },
    {
      ...mergedStories.stories.byId,
    }
  );

  const updatedMergedStories = {
    ...mergedStories,
    stories: {
      byId: updatedStoriesById,
      allIds: updatedStoriesAllIds,
    },
  };

  return updatedMergedStories;
};

const normalizeStories = stories => {
  return stories.reduce(
    (acc, story) => {
      const storyId = story.id;

      acc.stories.byId[storyId] = { ...story };
      acc.stories.allIds.push(storyId);

      return acc;
    },
    {
      stories: {
        byId: {},
        allIds: [],
      },
    }
  );
};

const denormalizeStories = stories => {
  const normalizedStories = stories.stories;

  if (!normalizedStories || normalizedStories.allIds.length === 0) {
    return [];
  }

  const denormalizedStories = normalizedStories.allIds.map(storyId => {
    return normalizedStories.byId[storyId];
  });

  return denormalizedStories;
};

export const storiesWithScope = (state, scope) => {
  const stories = state[scope || storyScopes.ALL];
  return denormalizeStories(stories);
};

export const denormalizeAllScopes = state => ({
  epic: storiesWithScope(state, storyScopes.EPIC),
  all: storiesWithScope(state, storyScopes.ALL),
  search: storiesWithScope(state, storyScopes.SEARCH),
});

const normalizeAllScopes = state => ({
  epic: normalizeStories(state[storyScopes.EPIC]),
  all: normalizeStories(state[storyScopes.ALL]),
  search: normalizeStories(state[storyScopes.SEARCH]),
});

export default withScope(storiesReducer);
