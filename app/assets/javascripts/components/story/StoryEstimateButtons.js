import React from 'react';

const renderButton = (point) => (
  <span
    className={`estimate estimate-${point} input`}
    key={point}
    data-value={point}
    id={`estimate-${point}`}
  >
    {point}
  </span>
);

const EstimateButtons = ({ points }) => (
  <div className="estimates">
    { points.map(renderButton) }
  </div>
);

export default EstimateButtons;
