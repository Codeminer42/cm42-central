import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStory from './CollapsedStory';
import ExpandedStory from './ExpandedStory';
import { connect } from 'react-redux';
import { toggleStory } from '../../actions/story';

export const StoryItem = (props) => {
  const { story, toggleStory } = props;

  return (
    <div className='story-container'>
      {
        story.collapsed ? (
          <CollapsedStory story={story} onToggle={() => toggleStory(story.id)} />
        ) : (
          <ExpandedStory story={story} onToggle={() => toggleStory(story.id)} />
        )
      }
    </div>
  );
};

StoryItem.propTypes = {
  story: PropTypes.object.isRequired
};

export default connect(
  null,
  { toggleStory }
)(StoryItem);
