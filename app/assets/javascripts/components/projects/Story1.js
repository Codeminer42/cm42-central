import React from 'react'

const SpanStory1 = () => (
  <div>
    <span className="estimate" data-value="1" id="estimate-1">1</span>
    <span className="estimate" data-value="2" id="estimate-1">2</span>
    <span className="estimate" data-value="3" id="estimate-1">3</span>
    <span className="estimate" data-value="5" id="estimate-1">5</span>
    <span className="estimate" data-value="8" id="estimate-1">8</span>
  </div>
)

const StateActions = () => (
  <div className='Story1__state-actions'>
    <SpanStory1 />
  </div>
)

const StoryIcons = ({icon, nameIcon}) => (
<div className='Story1__story-icons'>
  <span className='popover-activate' data-original-title='' title=''>
    <i className={`mi md-${icon} md-16`}>{nameIcon}</i>
    <span className='Story1__estimate' data-value='0'>-</span>
    <i className='mi md-14 md-dark details'>qw</i>
    <i className='mi md-14 md-dark details'>question_answer</i>
  </span>
</div>
)

const StoryTitle = ({name}) =>(
  <div className='Story1__story-title'>
    <span className='tags'>
      <a href='#' className='epic-link' title='features'>{name}</a>
    </span>
  </div>
)

const Story1 = ({ name, icon, nameIcon }) => (
  <div className ='Story1'>
      <StoryIcons icon={icon} nameIcon={nameIcon} />
      <StoryTitle name={name} />
      <StateActions />
  </div>

);

export default Story1
