import React from 'react';
import Message from './Message';
import PropTypes from 'prop-types';

const Notifications = ({ messages }) =>
  <div className="Notifications">
    {
      messages.map((message) =>
        <Message
          className="Notifications__Message"
          title={message.title}
          content={message.content}
          type={message.type}
        />
      )
    }
  </div>

Notifications.propTypes = {
  messages: PropTypes.array.isRequired
}

export default Notifications;
