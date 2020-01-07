import actionTypes from './actionTypes';

export const simulateSprintVelocity = (simulatedSprintVelocity) => ({
  type: actionTypes.SIMULATE_SPRINT_VELOCITY,
  simulatedSprintVelocity
})

export const revertSprintVelocity = () => ({
  type: actionTypes.REVERT_TO_CALCULATED_VELOCITY
})
