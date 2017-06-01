import React from 'react';

const renderOptions = (options, blank) => ([
  blank ? <option value='' key={options.length}> { blank } </option> : null,
  options.map((option, i) =>
    <option value={option[1]} key={i} label={option[0]} />
  )
]);

const StorySelect = ({ name, options, selected, disabled = false, blank, className }) =>
  <div>
    <label htmlFor={name}>{ I18n.t(`activerecord.attributes.story.${name}`) }</label>
    <br />
    <select
      name={name}
      className={`form-control input-sm ${className}`}
      defaultValue={selected}
      disabled={disabled}
    >
      { renderOptions(options, blank) }
    </select>
  </div>

export default StorySelect;
