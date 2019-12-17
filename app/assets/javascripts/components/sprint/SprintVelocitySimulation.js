import React, {useState} from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {SprintVelocitySimulationForm} from './SprintVelocitySimulationForm'
import {connect} from 'react-redux'
import { simulateSprintVelocity, revertSprintVelocity } from '../../actions/sprint';

export const SprintVelocitySimulation = ({
  currentSprintVelocity,
  calculatedSprintVelocity,
  simulateSprintVelocity,
  revertSprintVelocity
}) => {

  const [visible, setVisible] = useState(false)

  return ReactDOM.createPortal(
    <>
    <span id="velocity_value">
      <i className="mi md-18" onClick={() => setVisible(!visible)}>trending_up</i>
      {currentSprintVelocity}
    </span>
    { visible &&
      <SprintVelocitySimulationForm
        currentSprintVelocity={currentSprintVelocity}
        simulateSprintVelocity={simulateSprintVelocity}
        revertSprintVelocity={revertSprintVelocity}
        calculatedSprintVelocity={calculatedSprintVelocity}
      />
    }
    </>,
    document.querySelector('[data-portal="velocity"]'));
}

SprintVelocitySimulation.propTypes = {
  calculatedSprintVelocity: PropTypes.number,
  sprintVelocity: PropTypes.number,
  simulateSprintVelocity: PropTypes.func,
  revertSprintVelocity: PropTypes.func
}

const mapStateToProps = ({project}) => ({
  calculatedSprintVelocity: project.calculatedSprintVelocity,
  currentSprintVelocity: project.currentSprintVelocity
});

const mapDispatchToProps = {
  simulateSprintVelocity,
  revertSprintVelocity
};

export default connect(mapStateToProps, mapDispatchToProps)(SprintVelocitySimulation)
