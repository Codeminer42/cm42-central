/* eslint jsx-a11y/click-events-have-key-events:"off" */
/* eslint jsx-a11y/no-static-element-interactions:"off" */
/* eslint react/prop-types:"off" */
import React from 'react';

const renderButton = (point, onClick) => (
  <span
    className={`estimate estimate-${point} input`}
    key={point}
    data-value={point}
    id={`estimate-${point}`}
    onClick={() => onClick(point)}
  >
    {point}
  </span>
);

const EstimateButtons = ({ points, onClick }) => (
  <div className="estimates">
    {
      points.map(point => renderButton(point, onClick))
    }
  </div>
);

export default EstimateButtons;
