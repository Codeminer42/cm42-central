import React, { Fragment, useState, useCallback, useEffect } from "react";
import {connect} from 'react-redux'
import StoryItem from "../story/StoryItem";
import update from 'immutability-helper'
import {orderByState} from '../../selectors/backlog'
import { dragDropStory } from '../../actions/story'

const Stories = ({ stories, dragDropStory }) => {
  if (!stories.length) {
    return null;
  }

  const [storiesDND, setStories] = useState(stories)

  useEffect(() => {
    setStories(stories)
  }, [...stories.map(item => item.collapsed)])

  const moveTask = useCallback(
    (dragIndex, hoverIndex) => {
      const dragStory = storiesDND[dragIndex]
      const dragPosition = dragStory.position
      const hoverStory = storiesDND[hoverIndex]
      setStories(
        update(storiesDND, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragStory]],
        }),
      )
      dragDropStory(dragStory.id, dragStory.projectId, {position: hoverStory.position})
      dragDropStory(hoverStory.id, hoverStory.projectId, {position: dragPosition})
    },
    [storiesDND],
  )

  return (
    <Fragment>
      {storiesDND.map((story, index) => (
        <StoryItem key={story.id} index={index} stories={stories} story={story} moveTask={moveTask}/>
      ))}
    </Fragment>
  );
};

export default connect(null, {dragDropStory})(Stories);
