import React from 'react';
import PropTypes from 'prop-types';

const SpanStory = () => (
  <div>
    <span className="Story__estimate" data-value="1" id="estimate-1">1</span>
    <span className="Story__estimate" data-value="2" id="estimate-1">2</span>
    <span className="Story__estimate" data-value="3" id="estimate-1">3</span>
    <span className="Story__estimate" data-value="5" id="estimate-1">5</span>
    <span className="Story__estimate" data-value="8" id="estimate-1">8</span>
  </div>
)

const ShowButtonOrEstimate = ({ story_type, estimate, SpanStory, ButtonStart }) => (
  story_type === 'feature' && !estimate ?
  <SpanStory/> :
  <ButtonStart/>
);

const StateActions = ({ story_type, estimate }) => (
  <div className='Story__actions'>
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

const ButtonStart = () => (
  <button type="button" className="Story__btn Story__btn--start">start</button>
);

const estimateRule = (estimate) => estimate > 0 ? estimate : '-';

const StoryEstimate = ({ estimate }) => (
  <span className='Story__estimated'>{estimateRule(estimate)}</span>
);

StoryEstimate.propTypes = {
  estimate: PropTypes.number,
};

StoryEstimate.defaultProp = {
  estimate: '-',
};

const StoryIcons = ({ story_type }) => (
  <span className='Story__icon'>
    <i className={`mi md-${classIconRule(story_type)} md-16`}>{iconRule(story_type)}</i>
  </span>
);

StoryIcons.propTypes = {
  story_type: PropTypes.string.isRequired,
};

const labelSplit = (labels) => labels.split(',')

const StoryLabel = ({ label }) => (
  <a href="#" className="Story__label" title={label}>{label}</a>
);

StoryLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

const StoryLabels = ({ labels }) => {
  if (!labels) {
    return null
  }

  return (
    <span className='Story__labels'>
      {labelSplit(labels).map(label => (
        <StoryLabel key={label} label={label} />
      ))}
    </span>
  );
};

const StoryInfo = ({ story_type ,title, labels, estimate }) => (
  <div className="Story__info">
    <StoryLabels labels={labels} />
    <div className="Story__title">
      {title}
    </div>
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
    <StoryEstimate estimate={estimate} />
    <StoryInfo title={title} labels={labels} story_type={story_type} estimate={estimate} />
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
