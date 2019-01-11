import * as Label from './label';

export const deserialize = (board) => ({
  ...board.project,
  globalLabels: Label.splitLabels(board.globalLabels)
})
