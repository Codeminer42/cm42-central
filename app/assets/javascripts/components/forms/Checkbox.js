import React from 'react';

const Checkbox = ({ name, onChange, checked, disabled, children, label }) =>
  <label>
    <input
      type='checkbox'
      onChange={onChange}
      checked={checked}
      name={name}
      disabled={disabled}
    />
    { label }
    { children }
  </label>

export default Checkbox;
