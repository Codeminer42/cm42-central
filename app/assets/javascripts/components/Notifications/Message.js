import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ type, className, title, content }) => {
  const modifierClassName = type ? `Message--${type}` : '';

  return (
    <div className={`Message ${modifierClassName} ${className}`}>
      <div className="Message__title">
        {title}
        <button className="Message__title__button">
          <i className={`mi md-close md-18`}>close</i>
        </button>
      </div>
      <div className="Message__content">
        {content}
      </div>
    </div>
  )
};

Message.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};

export default Message;
