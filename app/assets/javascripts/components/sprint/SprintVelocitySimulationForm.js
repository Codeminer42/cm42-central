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
          <label className="sr-only" htmlFor="simulatedSprintVelocity">
            {I18n.t('override.velocity')}
          </label>
          <input
            type="number"
            min="1"
            className="form-control input-sm velocity-change-input"
            id="simulatedSprintVelocity"
            size="2"
            placeholder={I18n.t('override.velocity')}
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
          >
            {I18n.t('revert')}
          </button>
          <button
            name="apply"
            value="apply"
            className="btn btn-primary btn-sm velocity-change-btn"
            onClick={() => simulateSprintVelocity(sprintVelocityToSimulate)}
          >
            {I18n.t('apply')}
          </button>
        </div>
      </div>
      <p className="velocity-change-notice">{I18n.t('override.explanation_1')}</p>
      <p className="velocity-change-notice">{I18n.t('override.explanation_2')}</p>
    </div>
  )
};
