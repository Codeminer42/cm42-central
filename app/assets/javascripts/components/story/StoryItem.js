import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStory from './CollapsedStory';
import ExpandedStory from './ExpandedStory';
import { connect } from 'react-redux';
import { toggleStory } from '../../actions/story';
import { releaseIsLate, isHighlighted, isAccepted } from '../../models/beta/story';
import classNames from 'classnames';

export const StoryItem = ({ story, toggleStory, from, index, sprintIndex}) => {
  const className = classNames({
    'Story--late-release': releaseIsLate(story),
    'Story--highlighted': isHighlighted(story),
    'Story--accepted': isAccepted(story),
  });
  const title = releaseIsLate(story) ? I18n.t('story.warnings.backlogged_release') : '';

  const childProps = {
    story,
    onToggle: () => toggleStory(story.id, from),
    className,
    title,
    from,
    index,
    sprintIndex
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
            data-id="expanded-story"
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
