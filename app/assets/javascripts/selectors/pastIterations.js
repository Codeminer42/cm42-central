import { denormalizePastIterations } from "../models/beta/pastIteration";

export const getPastIterations = (state) => denormalizePastIterations(state);
