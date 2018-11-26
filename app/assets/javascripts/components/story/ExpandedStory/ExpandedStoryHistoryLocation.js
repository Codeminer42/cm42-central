import React from 'react';
import Clipboard from 'react-clipboard.js';

class ExpandedStoryHistoryLocation extends React.Component {
  storyURL(id) {
    const location = window.location.href;
    const hashIndex = location.indexOf('#');
    const endIndex = hashIndex > 0 ? hashIndex : location.length;
    return `${location.substring(0, endIndex)}#story-${id}`;
  }

  render() {
    const { story } = this.props

    return (
      <div className="col-xs-12 form-group input-group input-group-sm">
        <input
          className="form-control input-sm"
          id={`story-link-${story.id}`}
          readOnly="readonly"
          value={this.storyURL(story.id)}
        />

        <span className="input-group-btn">
          <button
            className="btn btn-default btn-clipboard"
            type="button"
            title={I18n.t('story.events.copy_url')}
          >
            <Clipboard
              data-clipboard-target={`#story-link-${story.id}`}
              component="span"
            >
              <img src="/clippy.svg" alt={I18n.t('story.events.copy_url')} className="clipboard-icon" />
            </Clipboard>
          </button>

          <button
            className="btn btn-default btn-clipboard-id btn-clipboard"
            type="button"
            title={I18n.t('story.events.copy_id')}
          >
            <Clipboard
              data-clipboard-text={story.id}
              component="span"
            >
              ID
            </Clipboard>
          </button>
        </span>
      </div>
    )
  }
}

export default ExpandedStoryHistoryLocation;
