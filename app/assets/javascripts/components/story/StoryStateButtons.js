/* eslint no-undef:"off" */
/* eslint react/prop-types:"off" */
import React from 'react';

const renderInputButton = event => (
  <input
    type="button"
    key={event}
    className={`transition ${event}`}
    value={I18n.t(`story.events.${event}`)}
  />
);

const StateButtons = ({ events }) => (
  <div className="state-actions">
    { events.map(renderInputButton) }
  </div>
);

export default StateButtons;
