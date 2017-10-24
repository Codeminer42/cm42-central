import React from 'react'

const renderInputButtons = (events) =>
  events.map((event) =>
    <input
      type="button"
      key={event}
      className={`transition ${event}`}
      value={I18n.t('story.events.' + event)}
    />
)

const StateButtons = (props) =>
  <div className="state-actions">
    { renderInputButtons(props.events) }
    { props.isSearchResult &&
      <button id="locate" type="button" className="btn btn-default locate-btn locate">
        <i className="mi md-gps-fixed md-14">gps_fixed</i>
      </button>
    }
  </div>

export default StateButtons
