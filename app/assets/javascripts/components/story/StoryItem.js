import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStory from './CollapsedStory';
import ExpandedStory from './ExpandedStory'
import { connect } from 'react-redux'
import { toggleStory } from '../../actions/story'

export const StoryItem = (props) => {
  const { story, onStoryClick } = props

  return (
    <div className='story-container'>
      {
        story.collapsed ? (
          <CollapsedStory story={story} onToggle={() => onStoryClick(story.id)} />
        ) : (
            <ExpandedStory story={story} onToggle={() => onStoryClick(story.id)} />
          )
      }
    </div>
  )
}

StoryItem.propTypes = {
  story: PropTypes.object.isRequired
};

export default connect(
  null,
  { onStoryClick: toggleStory }
)(StoryItem);
