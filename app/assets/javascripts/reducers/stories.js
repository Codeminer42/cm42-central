import actionTypes from "actions/actionTypes";
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
} from "models/beta/story";
import * as Note from "models/beta/note";
import * as Task from "models/beta/task";
import * as Label from "models/beta/label";
import { updateIfSameId } from "../services/updateIfSameId";
import { storyScopes } from "./../libs/beta/constants";
import { isEpic, mergeWithFetchedStories } from "../models/beta/story";

const initialState = {
  [storyScopes.ALL]: [],
  [storyScopes.SEARCH]: [],
  [storyScopes.EPIC]: [],
};

const storiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_STORIES:
      if (isEpic(action.from)) {
        return {
          ...state,
          [action.from]: action.data,
        };
      }
      return {
        ...state,
        [action.from]: mergeWithFetchedStories(
          state[action.from],
          action.data.stories,
          action.data.storyIds
        ),
      };
    case actionTypes.RECEIVE_PAST_STORIES:
      return {
        ...state,
        [action.from]: [...state[action.from], ...action.stories],
      };
    case actionTypes.CREATE_STORY:
      const newStory = createNewStory(state[action.from], action.attributes);

      return {
        ...state,
        [action.from]: replaceOrAddNewStory(state[action.from], newStory),
      };
    case actionTypes.ADD_STORY:
      return {
        ...state,
        [action.from]: replaceOrAddNewStory(state[action.from], action.story),
      };
    case actionTypes.CLONE_STORY:
      const clonedStory = cloneStory(action.story);

      return {
        ...state,
        [action.from]: replaceOrAddNewStory(state[action.from], clonedStory),
      };
    case actionTypes.TOGGLE_STORY:
      if (action.id === null) {
        return {
          ...state,
          [action.from]: withoutNewStory(state[action.from]),
        };
      }

      return {
        ...state,
        [action.from]: state[action.from].map(
          updateIfSameId(action.id, toggleStory)
        ),
      };
    case actionTypes.EDIT_STORY:
      return {
        ...state,
        [action.from]: state[action.from].map(
          updateIfSameId(action.id, (story) => {
            return editStory(story, action.newAttributes);
          })
        ),
      };
    case actionTypes.UPDATE_STORY_SUCCESS:
      return allScopes(state, action.story.id, (stories) => {
        return stories.map(
          updateIfSameId(action.story.id, (story) =>
            addNewAttributes(story, {
              ...action.story,
              needsToSave: false,
              loading: false,
            })
          )
        );
      });
    case actionTypes.SORT_STORIES_SUCCESS:
      return allScopes(state, null, (stories) => {
        return stories.map((story) => {
          const editingStory = action.stories.find(
            (incomingStory) => story.id === incomingStory.id
          );

          return editingStory
            ? addNewAttributes(story, {
                ...editingStory,
                needsToSave: false,
                loading: false,
              })
            : story;
        });
      });
    case actionTypes.OPTIMISTICALLY_UPDATE:
      return allScopes(state, action.story.id, (stories) => {
        return stories.map(
          updateIfSameId(action.story.id, (story) => {
            const newStory = setLoadingValue(action.story, true);
            return addNewAttributes(story, { ...newStory, needsToSave: false });
          })
        );
      });
    case actionTypes.STORY_FAILURE:
      return {
        ...state,
        [action.from]: state[action.from].map(
          updateIfSameId(action.id, (story) => {
            return storyFailure(story, action.error);
          })
        ),
      };
    case actionTypes.SET_LOADING_STORY:
      return {
        ...state,
        [action.from]: state[action.from].map(
          updateIfSameId(action.id, setLoadingStory)
        ),
      };
    case actionTypes.ADD_TASK:
      return {
        ...state,
        [action.from]: state[action.from].map(
          updateIfSameId(action.storyId, (story) => {
            return Task.addTask(story, action.task);
          })
        ),
      };
    case actionTypes.REMOVE_TASK:
      return {
        ...state,
        [action.from]: state[action.from].map(
          updateIfSameId(action.storyId, (story) => {
            return Task.deleteTask(action.task, story);
          })
        ),
      };
    case actionTypes.TOGGLE_TASK:
      return {
        ...state,
        [action.from]: state[action.from].map(
          updateIfSameId(action.story.id, (story) => {
            return Task.toggleTask(story, action.task);
          })
        ),
      };
    case actionTypes.DELETE_STORY_SUCCESS:
      return allScopes(state, action.id, (stories) => {
        return stories.filter((story) => story.id !== action.id);
      });
    case actionTypes.ADD_NOTE:
      return {
        ...state,
        [action.from]: state[action.from].map(
          updateIfSameId(action.storyId, (story) => {
            return Note.addNote(story, action.note);
          })
        ),
      };
    case actionTypes.HIGHLIGHT_STORY:
      return {
        ...state,
        [action.from]: state[action.from].map((story) => {
          return story.id === action.storyId
            ? { ...story, highlighted: action.highlighted }
            : story;
        }),
      };
    case actionTypes.DELETE_NOTE:
      return {
        ...state,
        [action.from]: state[action.from].map(
          updateIfSameId(action.storyId, (story) => {
            return Note.deleteNote(story, action.noteId);
          })
        ),
      };
    case actionTypes.ADD_LABEL:
      return {
        ...state,
        [action.from]: state[action.from].map(
          updateIfSameId(action.storyId, (story) => ({
            ...story,
            _editing: {
              ...story._editing,
              _isDirty: true,
              labels: Label.addLabel(story._editing.labels, action.label),
            },
          }))
        ),
      };
    case actionTypes.DELETE_LABEL:
      return {
        ...state,
        [action.from]: state[action.from].map(
          updateIfSameId(action.storyId, (story) => ({
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

const withScope = (reducer) => (state, action) => {
  const from = action.from || storyScopes.ALL;
  action = { ...action, from };

  return reducer(state, action);
};

const allScopes = (stories, storyId, mutation) => ({
  [storyScopes.ALL]: mutation(stories[storyScopes.ALL]),
  [storyScopes.SEARCH]: mutation(stories[storyScopes.SEARCH]),
  [storyScopes.EPIC]: mutation(stories[storyScopes.EPIC]),
});

export default withScope(storiesReducer);
