import React from 'react';
import StoryActionButton from './StoryActionButton';

const StoryHistoryLocation = ({ id, url }) => (
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
        title={I18n.t('story.events.copy_url')}
      >
        <img
          src="/clippy.svg"
          alt={I18n.t('story.events.copy_url')}
          className="clipboard-icon"
        />
      </button>

      <button
        className="btn btn-default btn-clipboard-id btn-clipboard"
        data-clipboard-text={`#${id}`}
        type="button"
        title={I18n.t('story.events.copy_id')}
      >
        ID
      </button>

      <StoryActionButton
        className={'toggle-history'}
        title={I18n.t('story.events.view_history')}
        iconName={'history'}
      />
      <StoryActionButton
        className={'clone-story'}
        title={I18n.t('story.events.clone')}
        iconName={'content_copy'}
      />
    </span>
  </div>
);

export default StoryHistoryLocation;
