import React from 'react';
import PropTypes from 'prop-types';

const StoryDescriptionIcon = ({ description }) => {
  if (description) {
    return (
      <span className='Story__description-icon' >
        <i className={`mi md-dark md-16 question_answer`}>question_answer</i>
      </span>
    )
  }
  return null
};

StoryDescriptionIcon.propTypes = {
  description: PropTypes.string
};

export default StoryDescriptionIcon;
