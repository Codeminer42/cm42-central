import React, { Fragment, useState, useCallback, useEffect } from "react";
import {connect} from 'react-redux'
import StoryItem from "../story/StoryItem";
import update from 'immutability-helper'
import { orderByState } from '../../selectors/backlog'
import { dragDropStory } from '../../actions/story'

const Stories = ({ stories, dragDropStory }) => {
  if (!stories.length) {
    return null;
  }

  const [storiesDND, setStories] = useState(stories)

  useEffect(() => {
    setStories(stories)
  }, [stories])


  const moveTask = useCallback(
    (dragIndex, hoverIndex, dragStory) => {
      const dragPosition = dragStory.position
      const hoverStory = storiesDND[hoverIndex]
      if(dragStory.state === "unscheduled"){
        const arr = storiesDND.filter(item => dragStory.id === item.id)
        if(arr.length >= 1){
          return null
        }
      }
      setStories(
        update(storiesDND, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragStory]],
        }),
      )
    },
    [storiesDND],
  )

  return (
    <Fragment>
      {storiesDND.map((story, index) => (
        <StoryItem key={story.id} index={index} stories={storiesDND} story={story} moveTask={moveTask}/>
      ))}
    </Fragment>
  );
};

export default connect(null, {dragDropStory})(Stories);
