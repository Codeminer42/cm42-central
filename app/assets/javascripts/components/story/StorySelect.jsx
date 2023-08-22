import React, { Fragment } from 'react';

const renderOption = (option, i) => <option value={option[1]} key={i}> {option[0]} </option>;

const renderOptions = (options, blank) => ([
  blank && <option value='' key={options.length}> { blank } </option>,
  options.map(renderOption)
]);

const StorySelect = ({ name, options, selected, disabled = false, blank, className }) =>
  <Fragment>
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
  </Fragment>

export default StorySelect;
