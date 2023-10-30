import { createSelector } from "reselect";
import { orderByState, groupStoriesInSprints } from "./backlog";
import { mountPastIterations } from "./done";
import * as Column from "../models/beta/column";
import { comparePosition } from "../models/beta/story";
import { property, last } from "underscore";
import { denormalizePastIterations } from "../models/beta/pastIteration";
import { getStoriesByScope } from "./stories";

const getStories = property("stories");
const getColumn = property("column");
const getProject = property("project");
const getPastIterations = property("pastIterations");

export const getColumns = createSelector(
  [getColumn, getStories, getProject, getPastIterations],
  (column, stories, project, pastIterations) => {
    const denormalizedPastIterations =
      denormalizePastIterations(pastIterations);

    switch (column) {
      case Column.CHILLY_BIN:
        return getStoriesByScope(stories)
          .filter(Column.isChillyBin)
          .sort(comparePosition);
      case Column.BACKLOG:
        const orderedStories = orderByState(
          getStoriesByScope(stories).filter((story) =>
            Column.isBacklog(story, project)
          )
        );

        const lastPastIteration = last(denormalizedPastIterations);
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
          denormalizedPastIterations,
          getStoriesByScope(stories)
        );
      case Column.EPIC:
        return getStoriesByScope(stories, Column.EPIC);
    }
  }
);
