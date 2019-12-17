import React,{ useState } from 'react'

export const SprintMenu = ({sprintVelocity, onSimulate, calculatedSprintVelocity, onRevert}) => {
  const [simulatedSprintVelocity, setSimulatedSprint] = useState(sprintVelocity)

  return(
    <div className="velocity-change">
      <div className="form-inline velocity-form" id="override-velocity">
        <div className="form-group">
          <label className="sr-only" htmlFor="override">{sprintVelocity}</label>
          <input type="number" className="form-control input-sm velocity-change-input"
            name="override" size="2"
            placeholder={sprintVelocity} value={simulatedSprintVelocity}
            onChange={ e => setSimulatedSprint(e.target.value)}
            />
        </div>
        <div className="btn-group">
          <button
            name="revert"
            value="revert"
            className="btn btn-default btn-sm velocity-change-btn"
            onClick={() => {
              setSimulatedSprint(calculatedSprintVelocity);
              onRevert()
              }
            }
          >revert</button>
          <button name="apply" value="apply" className="btn btn-primary btn-sm velocity-change-btn" onClick={() => onSimulate(simulatedSprintVelocity)}>apply</button>
        </div>
      </div>
      <p className="velocity-change-notice">You can simulate with different velocity values.</p>
      <p className="velocity-change-notice">The iterations will be temporatily recalculated to reflect the simulated velocity but the real Velocity will still be the average of the last 3 iterations.</p>
    </div>
  )
}
