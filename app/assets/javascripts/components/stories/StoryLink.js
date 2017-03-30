import React from 'react';
import hoverTemplate from 'templates/story_hover.ejs';
import noteTemplate from 'templates/note.ejs';

const STORY_STATE_ICONS = {
  unstarted: 'access_time',
  started:   'check_box_outline_blank',
  finished:  'check_box',
  delivered: 'hourglass_empty',
  rejected:  'close',
  accepted:  'done'
};

export default class StoryLink extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { story } = this.props;
    document.getElementById(`story-${story.get('id')}`).scrollIntoView();
    story && _.each(story.views, view => view.highlight());
  }

  renderIcon(storyState) {
    return (
      <i className={`mi story-link-icon ${storyState}`}>
        {STORY_STATE_ICONS[storyState]}
      </i>
    );
  }

  render() {
    const { story } = this.props;
    const storyState = story.get('state');
    const id = story.get('id');
    const popoverContent = hoverTemplate({
      story: story,
      noteTemplate: noteTemplate
    });

    return (
      <a className={`story-link popover-activate ${storyState}`}
         data-content={popoverContent}
         data-original-title={story.get('title')}
         id={`story-link-${id}`}
         onClick={this.handleClick}>
        { `#${id}` }
        { (storyState !== 'unscheduled') && this.renderIcon(storyState) }
      </a>
    );
  }
}
