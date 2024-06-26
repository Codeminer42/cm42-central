import React from 'react';
import Clipboard from 'react-clipboard.js';
import { storyUrl } from '../StoryUrl';
import {
  editingStoryPropTypesShape,
  hasHistory,
} from '../../../models/beta/story';
import PropTypes from 'prop-types';

const ExpandedStoryHistoryLocation = ({ story, onClone, showHistory }) => (
  <div className="col-xs-12 form-group input-group input-group-sm">
    <input
      className="form-control input-sm"
      id={`story-link-${story.id.toString()}`}
      readOnly
      value={storyUrl(story)}
    />

    <span className="input-group-btn">
      <Clipboard
        data-clipboard-text={storyUrl(story)}
        component="button"
        className="btn btn-default btn-clipboard"
        button-title={I18n.t('story.events.copy_url')}
      >
        <img
          src="/clippy.svg"
          alt={I18n.t('story.events.copy_url')}
          className="clipboard-icon"
        />
      </Clipboard>

      <Clipboard
        data-clipboard-text={`#${story.id.toString()}`}
        component="button"
        className="btn btn-default btn-clipboard-id btn-clipboard"
        button-title={I18n.t('story.events.copy_id')}
      >
        ID
      </Clipboard>

      {hasHistory(story) && (
        <button
          className="btn btn-default"
          title={I18n.t('story.events.view_history')}
          onClick={showHistory}
          data-id="history-button"
        >
          <i className="mi md-18">history</i>
        </button>
      )}

      <button
        className="btn btn-default clone-story"
        title={I18n.t('story.events.clone')}
        onClick={onClone}
      >
        <i className="mi md-18">content_copy</i>
      </button>
    </span>
  </div>
);

ExpandedStoryHistoryLocation.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onClone: PropTypes.func.isRequired,
  showHistory: PropTypes.func.isRequired,
};

export default ExpandedStoryHistoryLocation;
