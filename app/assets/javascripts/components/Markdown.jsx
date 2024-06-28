import React from 'react';
import Parser from 'html-react-parser';
import memoize from 'memoizee';
import PropTypes from 'prop-types';

const Markdown = ({ source }) => {
  if (source) {
    const descriptionHTML = window.md.makeHtml(source);
    const descriptionComponent = Parser(descriptionHTML);

    return <div className="Markdown">{descriptionComponent}</div>;
  }

  return null;
};

Markdown.propTypes = {
  source: PropTypes.string,
};

const MemoizedMarkdown = memoize(Markdown);
MemoizedMarkdown.displayName = 'Markdown';
export default MemoizedMarkdown;
