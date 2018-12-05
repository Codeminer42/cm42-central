import { createSelector } from 'reselect';
import { orderByState, groupStoriesInSprints } from "./backlog";
import { mountPastIterations } from './done';
import actionTypes from '../actions/actionTypes';
import * as Column from "../models/beta/column";

const getStories = (state) => state.stories;
const getColumn = (state) => state.column;
const getProject = (state) => state.project;
const getPastIterations = (state) => state.pastIterations;

export const getColumns = createSelector(
  [getColumn, getStories, getProject, getPastIterations],
  (column, stories, project, pastIterations) => {
    switch (column) {
      case actionTypes.COLUMN_CHILLY_BIN:
        return stories.filter(story => Column.isChillyBin(story));
      case actionTypes.COLUMN_BACKLOG:
        const orderedStories = orderByState(stories.filter(
          story => Column.isBacklog(story, project))
        );

        return groupStoriesInSprints(orderedStories, project);
      case actionTypes.COLUMN_DONE:
        return mountPastIterations(pastIterations);
    }
  }
);
