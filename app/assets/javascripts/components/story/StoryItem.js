import React from 'react';
import PropTypes from 'prop-types';

const SpanStory = () => (
  <div>
    <span className="estimate" data-value="1" id="estimate-1">1</span>
    <span className="estimate" data-value="2" id="estimate-1">2</span>
    <span className="estimate" data-value="3" id="estimate-1">3</span>
    <span className="estimate" data-value="5" id="estimate-1">5</span>
    <span className="estimate" data-value="8" id="estimate-1">8</span>
  </div>
)

const ShowButtonOrEstimate = ({ story_type, estimate, SpanStory, ButtonStart }) => (
  story_type === 'feature' && !estimate ?
    <SpanStory/> :
    <ButtonStart/>
);

const StateActions = ({ story_type, estimate }) => (
  <div className='Story__state-actions'>
    <ShowButtonOrEstimate
      story_type={story_type}
      estimate={estimate}
      SpanStory={SpanStory}
      ButtonStart={ButtonStart}
    />
  </div>
)
StateActions.propTypes = {
  story_type : PropTypes.string.isRequired
}
{/*<i className='mi md-14 md-dark details'>qw</i>
   <i className='mi md-14 md-dark details'>question_answer</i> */}

const iconRule = (story_type) => {
  switch (story_type) {
    case 'feature':
      return 'star';
    case 'bug':
      return 'bug_report';
    case 'chore':
      return 'settings'
    case 'release':
      return 'bookmark'
    default:
      return null
  }
};

const classIconRule = (story_type) => {
  switch (story_type) {
    case 'feature':
      return 'star'
    case 'bug':
      return 'bug';
    case 'chore':
      return 'dark' ;
    case 'release':
      return 'release'
    default:
      return null
  }
};



      {/*<i className='mi md-14 md-dark details'>qw</i>
      <i className='mi md-14 md-dark details'>question_answer</i>*/}

const ButtonStart = () => (
  <div>
    <input type="button" className="transition start" value="start" />
  </div>
);

const StoryIcons = ({ story_type }) => (
  <div className='Story__story-icons'>
    <span className='popover-activate' data-original-title='' title=''>
      <i className={`mi md-${classIconRule(story_type)} md-16`}>{iconRule(story_type)}</i>
      <span className='Story__estimate' data-value='0'>-</span>
    </span>
  </div>
);

StoryIcons.propTypes = {
  story_type: PropTypes.string.isRequired,
};

const labelSplit = (labels) => labels.split(',')

const StoryLabel = ({ label }) => (
  <a href="#" className="epic-link" title={label}>{label}</a>
);

StoryLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

const StoryLabels = ({ labels }) => {
  if (!labels) {
    return null
  }

  return (
    <span className='tags'>
      {labelSplit(labels).map(label => (
        <StoryLabel key={label} label={label} />
      ))}
    </span>
  );
};

const StoryInfo = ({ title, labels }) => (
  <div className='Story__story-title'>
    <StoryLabels labels={labels} />
    {title}
  </div>
);

StoryInfo.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.string,
};

StoryInfo.defaultProps = {
  labels: '',
};

const StoryItem = ({ title, story_type, estimate, labels }) => (
  <div className='Story'>
    <StoryIcons story_type={story_type} />
    <StoryInfo title={title} labels={labels} />
    <StateActions story_type={story_type} estimate={estimate}/>
  </div>
);

StoryItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  story_type: PropTypes.string.isRequired,
  labels: PropTypes.any,
};

StoryItem.defaultProps = {
  description: '',
}

export default StoryItem
