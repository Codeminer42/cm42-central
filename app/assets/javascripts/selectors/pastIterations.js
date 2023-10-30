import { denormalizePastIterations } from "../models/beta/pastIteration";

export const getIterations = (state) => denormalizePastIterations(state);
