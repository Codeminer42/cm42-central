import React, {useState} from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {SprintMenu} from './SprintMenu'

export const SprintButton = ({calculatedSprintVelocity, sprintVelocity, onSimulate, onRevert}) => {

  const [visible, setVisible] = useState(false)

  return ReactDOM.createPortal(
    <>
    <span id="velocity_value">
      <i className="mi md-18" onClick={() => setVisible(!visible)}>trending_up</i>
      {sprintVelocity}
    </span>
    { visible &&
      <SprintMenu
        sprintVelocity={sprintVelocity}
        onSimulate={onSimulate}
        onRevert={onRevert}
        calculatedSprintVelocity={calculatedSprintVelocity}
      />
    }
    </>,
    document.querySelector('[data-portal="velocity"]'));
}

SprintButton.propTypes = {
  calculatedSprintVelocity: PropTypes.number,
  sprintVelocity: PropTypes.number,
  simulateSprintVelocity: PropTypes.func,
  revertSprintVelocity: PropTypes.func
}
