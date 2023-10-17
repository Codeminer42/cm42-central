import { createSelector } from "reselect";
import { orderByState, groupStoriesInSprints } from "./backlog";
import { mountPastIterations } from "./done";
import * as Column from "../models/beta/column";
import {
  comparePosition,
  denormalizeState,
  withScope,
} from "../models/beta/story";
import { property, last } from "underscore";

const getStories = property("stories");
const getColumn = property("column");
const getProject = property("project");
const getPastIterations = property("pastIterations");

export const getColumns = createSelector(
  [getColumn, getStories, getProject, getPastIterations],
  (column, stories, project, pastIterations) => {
    const denormalizedStories = denormalizeState(stories);

    switch (column) {
      case Column.CHILLY_BIN:
        return withScope(denormalizedStories)
          .filter(Column.isChillyBin)
          .sort(comparePosition);
      case Column.BACKLOG:
        const orderedStories = orderByState(
          withScope(denormalizedStories).filter((story) =>
            Column.isBacklog(story, project)
          )
        );

        const lastPastIteration = last(pastIterations);
        const firstSprintNumber = lastPastIteration
          ? lastPastIteration.iterationNumber + 1
          : 1;
        return groupStoriesInSprints(
          orderedStories,
          project,
          firstSprintNumber
        );
      case Column.DONE:
        return mountPastIterations(
          pastIterations,
          withScope(denormalizedStories)
        );
      case Column.EPIC:
        return withScope(denormalizedStories, Column.EPIC);
    }
  }
);
