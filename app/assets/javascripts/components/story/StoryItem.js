import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStory from './CollapsedStory';
import ExpandedStory from './ExpandedStory'
import { connect } from 'react-redux'
import actionTypes from '../../actions/actionTypes'

export const StoryItem = (props) => {
  const { story, onStoryClick } = props

  return (
    <div className='story-container'>
      {
        story.collapsed ? (
          <CollapsedStory story={story} onToggle={() => onStoryClick(story.id)} />
        ) : (
            <ExpandedStory story={story} onToggle={() => onStoryClick(story.id)}/>
          )
      }
    </div>
  )
}

StoryItem.propTypes = {
  story: PropTypes.object.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    onStoryClick: (id) => {
      dispatch({
        type: actionTypes.TOGGLE_STORY,
        id
      })
    }
  }
};

export default connect(null, mapDispatchToProps)(StoryItem);
