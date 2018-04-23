import React from 'react'

const StateActions = () => (
  <div className="Story1__state-actions">
    <span className="" data-value="1" id="estimate-1">1</span>
    <span className="" data-value="2" id="estimate-2">2</span>
    <span className="" data-value="3" id="estimate-3">3</span>
    <span className="" data-value="5" id="estimate-5">5</span>
    <span className="" data-value="8" id="estimate-8">8</span>
  </div>
)

const StoryIcons = () => (
  <div className="Story1__story-icons">
  <span className="popover-activate" data-original-title="" title="">
    <i className="mi md-star md-16">star</i>
    <span className="estimate" data-value="0">-</span>
    <i className="mi md-14 md-dark details">qw</i>
    <i className="mi md-14 md-dark details">question_answer</i>
  </span>
</div>
)

const StoryTitle = () =>(
  <div className="Story1__story-title">
    <span className="tags">
      <a href="#" className="epic-link" title="features">The msg'll be here</a>
    </span>
  </div>
)

const Story1 = () => (
  <div className="Story1">
      <StoryIcons />
      <StoryTitle />
      <StateActions />
  </div>
);

export default Story1
