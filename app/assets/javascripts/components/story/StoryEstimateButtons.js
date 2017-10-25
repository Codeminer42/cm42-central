import React from 'react'

const renderButtons = (points) =>
  points.map((point) =>
    <span
      className={`estimate estimate-${point} input`}
      key={point}
      data-value={point}
      id={`estimate-${point}`}
    >{point}</span>
  )

const EstimateButtons = (props) =>
  <div className="estimates">
    <form>
    { renderButtons(props.points) }
    </form>
  </div>

export default EstimateButtons
