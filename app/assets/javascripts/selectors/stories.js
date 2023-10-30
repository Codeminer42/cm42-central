import {
  denormalizeState,
  denormalizeStories,
  withScope,
} from "../models/beta/story";

export const getStories = (state) => denormalizeState(state);

export const getStoriesByScope = (state, scope) =>
  denormalizeStories(withScope(state, scope || undefined));
