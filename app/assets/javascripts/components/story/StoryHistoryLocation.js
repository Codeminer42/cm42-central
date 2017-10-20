import React from 'react';

const StoryHistoryLocation = ({ id, url }) =>
  <div className="col-xs-12 form-group input-group input-group-sm">
    <input
      className="form-control input-sm"
      id={`story-link-${id}`}
      readOnly="readonly"
      value={url}
    />

    <span className="input-group-btn">
      <button
        className="btn btn-default btn-clipboard"
        data-clipboard-target={`#story-link-${id}`}
        type="button"
      >
        <img src="/clippy.svg" alt="Copy to clipboard" className="clipboard-icon" />
      </button>

      <button
        className="btn btn-default btn-clipboard-id btn-clipboard"
        data-clipboard-text={`#${id}`}
        type="button"
      >
        ID
      </button>

      <button className="btn btn-default toggle-history">
        <i className="mi md-18">history</i>
      </button>

      <button className="btn btn-default clone-story" title={I18n.t('story.events.clone')}>
        <i className="mi md-18">content_copy</i>
      </button>
    </span>
  </div>

export default StoryHistoryLocation;
