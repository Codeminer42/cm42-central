/* eslint react/prop-types:"off" */
/* eslint react/jsx-indent:"off" */
import React from 'react';

const Checkbox = ({
  name, onChange, checked, disabled, children, label,
}) =>
  (<label>
    <input
      type="checkbox"
      name={name}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
    { label }
    { children }
   </label>);

export default Checkbox;
