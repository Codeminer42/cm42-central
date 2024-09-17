import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ type, className, message, onRemove }) => {
  const modifierClassName = type ? `Message--${type}` : '';

  return (
    <div
      className={`Message ${modifierClassName} ${className}`}
      data-testid="message-container"
    >
      <div className="Message__content">
        {message}
        <button
          id="close-button"
          data-testid="message-close-button"
          className="Message__content__button"
          onClick={onRemove}
        >
          <i className={`mi md-close md-18`}>close</i>
        </button>
      </div>
    </div>
  );
};

Message.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  message: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Message;
