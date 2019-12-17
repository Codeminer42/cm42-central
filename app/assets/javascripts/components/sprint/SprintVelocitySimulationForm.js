import React,{ useState } from 'react'

export const SprintVelocitySimulationForm = ({
  currentSprintVelocity,
  calculatedSprintVelocity,
  simulateSprintVelocity,
  revertSprintVelocity
}) => {
  const [sprintVelocityToSimulate, setSprintVelocityToSimulate] = useState(currentSprintVelocity)
  const revertToCalculatedVelocity = () => {
    setSprintVelocityToSimulate(calculatedSprintVelocity);
    revertSprintVelocity()
  }

  return(
    <div className="velocity-change">
      <div className="form-inline velocity-form">
        <div className="form-group">
          <label className="sr-only" htmlFor="simulatedSprintVelocity">{currentSprintVelocity}</label>
          <input
            type="number"
            min="1"
            className="form-control input-sm velocity-change-input"
            id="simulatedSprintVelocity"
            size="2"
            placeholder={currentSprintVelocity}
            value={sprintVelocityToSimulate}
            onChange={ e => setSprintVelocityToSimulate(e.target.value)}
          />
        </div>
        <div className="btn-group">
          <button
            name="revert"
            value="revert"
            className="btn btn-default btn-sm velocity-change-btn"
            onClick={revertToCalculatedVelocity}
          >revert</button>
          <button
            name="apply"
            value="apply"
            className="btn btn-primary btn-sm velocity-change-btn"
            onClick={() => simulateSprintVelocity(sprintVelocityToSimulate)}>apply
          </button>
        </div>
      </div>
      <p className="velocity-change-notice">You can simulate with different velocity values.</p>
      <p className="velocity-change-notice">The iterations will be temporatily recalculated to reflect the simulated velocity but the real Velocity will still be the average of the last 3 iterations.</p>
    </div>
  )
};
