import React from 'react';

const renderOptions = (options, blank) => ([
  <option value='' key={options.length}> {blank} </option>,
  options.map((estimatePoints, i) =>
    <option value={estimatePoints} key={i}>
      {estimatePoints}
    </option>
  )
]);

const StorySelect = ({ name, options, selected, blank = '---', disabled = false }) =>
  <div className='form-group'>
    <label htmlFor={name}>{ I18n.t(`activerecord.attributes.story.${name}`) }</label>
    <br />
    <select
      name={name}
      className={`form-control input-sm story_${name}`}
      defaultValue={selected}
      disabled={disabled}
    >
      { renderOptions(options, blank) }
    </select>
  </div>

export default StorySelect;
