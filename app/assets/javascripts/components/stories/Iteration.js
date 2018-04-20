/* eslint import/no-extraneous-dependencies:"off" */
/* eslint react/require-default-props:"off" */
/* eslint react/prop-types:"off" */
/* eslint react/no-unused-prop-types:"off" */
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  iterationNumber: PropTypes.node,
  iterationStartDate: PropTypes.node,
  points: PropTypes.node,
};

const Iteration = ({ number, startDate, points }) => (
  <div>
    {number} - {startDate}
    <span className="points">{points}</span>
  </div>
);

Iteration.propTypes = propTypes;

export default Iteration;
