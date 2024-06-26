import React from 'react';
import PropTypes from 'prop-types';

const SelectUser = ({ selectedUserId, onEdit, disabled, users }) => (
  <select
    value={selectedUserId || ''}
    className="form-control input-sm"
    onChange={event => onEdit(event.target.value)}
    disabled={disabled}
  >
    <option value="">----</option>
    {users.map(user => (
      <option value={user.id} key={user.id}>
        {user.name}
      </option>
    ))}
  </select>
);

SelectUser.propTypes = {
  selectedUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onEdit: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  disabled: PropTypes.bool.isRequired,
};

export default SelectUser;
