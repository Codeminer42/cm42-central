import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  iterationNumber: PropTypes.node,
  iterationStartDate: PropTypes.node,
  points: PropTypes.node,
};

const Iteration = ({ number, startDate, points }) => {
    return (
      <Fragment>
        {number} - {startDate}
        <span className="points">{points}</span>
      </Fragment>
    );
}

Iteration.propTypes = propTypes;

export default Iteration;
