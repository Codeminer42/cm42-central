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
      points.map((point) => renderButton(point, onClick))
    }
  </div>
);

export default EstimateButtons;
