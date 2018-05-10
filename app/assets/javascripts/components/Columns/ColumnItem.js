import React from 'react'
import Stories from '../stories/Stories';

const Column = ({ title, stories }) => (
  <div className="Column">
    <div className="Column__header">
      <h3 className="Column__name">{title}</h3>
      <button type="button" className="Column__btn-close">x</button>
    </div>
    <Stories stories={stories} />
  </div>
);

export default Column
