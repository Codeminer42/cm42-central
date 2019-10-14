import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStory from './CollapsedStory';
import ExpandedStory from './ExpandedStory';
import { connect } from 'react-redux';
import { toggleStory } from '../../actions/story';
import { releaseIsLate, isHighlighted } from '../../models/beta/story';

export const StoryItem = ({ story, toggleStory, from }) => {
  const className = releaseIsLate(story) ? 'Story--late-release' : '';
  const title = releaseIsLate(story) ? I18n.t('story.warnings.backlogged_release') : '';
  const styleFocus = isHighlighted(story) ? 'Story--highlighted' : '';

  const childProps = {
    story,
    onToggle: () => toggleStory(story.id, from),
    className: `${className} ${styleFocus}`,
    title,
    from
  }

  return (
    <div className='story-container'>
      {
        story.collapsed
          ? <CollapsedStory
            {...childProps}
          />
          : <ExpandedStory
            {...childProps}
          />
      }
    </div>
  );
};

StoryItem.propTypes = {
  story: PropTypes.object.isRequired,
  toggleStory: PropTypes.func.isRequired
};

export default connect(
  null,
  { toggleStory }
)(StoryItem);
