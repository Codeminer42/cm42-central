import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStory from './CollapsedStory';
import ExpandedStory from './ExpandedStory';
import { connect } from 'react-redux';
import { toggleStory } from '../../actions/story';
import { releaseIsLate, isHighlighted, isAccepted } from '../../models/beta/story';

export const StoryItem = ({ story, toggleStory, from }) => {
  const releaseClass = releaseIsLate(story) ? 'Story--late-release' : '';
  const title = releaseIsLate(story) ? I18n.t('story.warnings.backlogged_release') : '';
  const highlightClass = isHighlighted(story) ? 'Story--highlighted' : '';
  const acceptedClass = isAccepted(story) ? 'Story--accepted' : '';

  const childProps = {
    story,
    onToggle: () => toggleStory(story.id, from),
    className: `${releaseClass} ${highlightClass} ${acceptedClass}`,
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
