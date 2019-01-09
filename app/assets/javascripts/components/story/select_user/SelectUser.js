import React from 'react';
import PropTypes from 'prop-types';

export default SelectUser = ({ userId, onEdit, users }) => (
  <select
    value={userId || ''}
    className="form-control input-sm"
    onChange={(event) => onEdit(event.target.value)}
  >
    <option value=''>
      ----
    </option>
    {
      users.map((user) => (
        <option
          value={user.id}
          key={user.id}
        >
          {user.name}
        </option>
      ))
    }
  </select>
);

SelectUser.PropTypes = {
  userId: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  users: PropTypes.shape({
    id: PropTypes.number.isRequired,
    inamed: PropTypes.string.isRequired
  })
};
