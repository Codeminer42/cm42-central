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
  <div>
    { renderInputButtons(props.events) }
  </div>

export default StateButtons
