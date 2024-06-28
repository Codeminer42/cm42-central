import React from 'react';
import Markdown from '../../../Markdown';
import PropTypes from 'prop-types';

const ExpandedStoryDescriptionContent = ({ description }) => (
  <div className="markdown-wrapper">
    <Markdown source={description} />
  </div>
);

ExpandedStoryDescriptionContent.propTypes = {
  description: PropTypes.string.isRequired,
};

export default ExpandedStoryDescriptionContent;
