import React from 'react';
import { storyUrl } from '../StoryUrl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
      <CopyToClipboard text={storyUrl(story)}>
        <img
          src="/clippy.svg"
          alt={I18n.t('story.events.copy_url')}
          className="clipboard-icon"
        />
      </CopyToClipboard>

      <CopyToClipboard text={`#${story.id}`}>
        <p className="btn btn-default btn-clipboard-id btn-clipboard">
          ID {`#${story.id.toString()}`}
        </p>
      </CopyToClipboard>

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
  showHistory: PropTypes.func,
};

export default ExpandedStoryHistoryLocation;
