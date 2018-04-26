import React from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import {
  classIconRule,
  iconRule,
  isStoryDontEstimated,
  IsShow,
  estimateRule,
  labelSplit,
  isRelease,
} from '../../rules/story';

const StoryPoints = () => (
  <div>
    <span className="Story__estimate">1</span>
    <span className="Story__estimate">2</span>
    <span className="Story__estimate">3</span>
    <span className="Story__estimate">5</span>
    <span className="Story__estimate">8</span>
  </div>
)

const StateActions = ({ story_type, estimate }) => (
  <div className='Story__actions'>
    <IsShow logic={isStoryDontEstimated(story_type, estimate)}>
      <StoryPoints />
    </IsShow>
    <IsShow logic={!isStoryDontEstimated(story_type, estimate)}>
      <ButtonStart />
    </IsShow>
  </div>
)
StateActions.propTypes = {
  story_type : PropTypes.string.isRequired
}

const ButtonStart = () => (
  <button type="button" className="Story__btn Story__btn--start">start</button>
);

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

const classNameStory = (story_type, estimate) => classname (
  'Story',
  {
    'Story--unestimated': isStoryDontEstimated(story_type, estimate),
    'Story--estimated': !isStoryDontEstimated(story_type, estimate),
    'Story--release' : isRelease(story_type)
  }
);

const StoryItem = ({ title, story_type, estimate, labels }) => (
  <div className={classNameStory(story_type, estimate)}>
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
