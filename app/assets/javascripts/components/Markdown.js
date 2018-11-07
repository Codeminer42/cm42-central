import React from 'react';
import Parser from 'html-react-parser';
import memoize from 'memoizee';

const Markdown = ({ source }) => {
  const descriptionHTML = window.md.makeHtml(source);
  source = Parser(descriptionHTML);

  if (source) {
    return (
      <div className={'markdown'}>{source}</div>
    );
  }
  return null;
}

export default memoize(Markdown);
