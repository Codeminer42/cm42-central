import React from 'react';

const Checkbox = ({ name, onChange, checked, disabled, children, label }) =>
  <label>
    <input
      type='checkbox'
      name={name}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
    { label }
    { children }
  </label>

export default Checkbox;
