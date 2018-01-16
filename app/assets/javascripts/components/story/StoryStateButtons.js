import React from 'react';

const renderInputButton = (event) => (
  <input
    type="button"
    key={event}
    className={`transition ${event}`}
    value={I18n.t('story.events.' + event)}
  />
);

const StateButtons = ({ events, isSearchResult }) => (
  <div className="state-actions">
    { events.map(renderInputButton) }
    { isSearchResult &&
      <button id="locate" type="button" className="btn btn-default locate-btn locate">
        <i className="mi md-gps-fixed md-14">gps_fixed</i>
      </button>
    }
  </div>
);

export default StateButtons;
