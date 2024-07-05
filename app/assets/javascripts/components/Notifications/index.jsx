import React from 'react';
import Message from './Message';
import PropTypes from 'prop-types';

const Notifications = ({ notifications, onRemove }) => (
  <div className="Notifications">
    {notifications.map(notification => (
      <Message
        className="Notifications__Message"
        message={notification.message}
        type={notification.type}
        onRemove={() => onRemove(notification.id)}
        key={notification.id}
      />
    ))}
  </div>
);

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Notifications;
