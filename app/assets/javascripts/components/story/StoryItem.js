import React from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import StoryPopover from './StoryPopover';
import StoryDescriptionIcon from './StoryDescriptionIcon'
import {
  classIconRule,
  iconRule,
  isStoryNotEstimated,
  IsShow,
  estimateRule,
  labelSplit,
  isRelease,
} from '../../rules/story';

const StateAction = {
  started: ["finish"],
  finished: ["deliver"],
  delivered: ["accept","reject"],
  rejected: ["restart"],
  accepted: [],
  unstarted: ["start"]
};

export const StoryPoints = () => (
  <div>
    <span className="Story__estimate">1</span>
    <span className="Story__estimate">2</span>
    <span className="Story__estimate">3</span>
    <span className="Story__estimate">5</span>
    <span className="Story__estimate">8</span>
  </div>
);

export const StateActions = ({ storyType, estimate, state }) => (
  <div className='Story__actions'>
    {
      isStoryNotEstimated(storyType, estimate)
        ? <StoryPoints />
        : StoryActionFor(state).map((stateAction) => <StateButton action={stateAction} key={stateAction} />)
    }
  </div>
);

const StoryActionFor = (state) => StateAction[state] || StateAction.unstarted;  

StateActions.propTypes = {
  storyType: PropTypes.string.isRequired,
  estimate: PropTypes.number,
  state: PropTypes.string.isRequired
};

StateActions.defaultProp = {
  estimate: '-',
};

export const StateButton = ({ action }) => (
  <button type="button" className={`Story__btn Story__btn--${action}`}>
    { I18n.translate('story.events.' + action) }
  </button>
);

StateButton.propTypes = {
  action: PropTypes.string.isRequired
};

const StoryEstimate = ({ estimate }) => (
  <span className='Story__estimated'>{estimateRule(estimate)}</span>
);

StoryEstimate.propTypes = {
  estimate: PropTypes.number,
};

StoryEstimate.defaultProp = {
  estimate: '-',
};

const StoryIcon = ({ storyType }) => (
  <span className='Story__icon'>
    <i className={`mi md-${classIconRule(storyType)} md-16`}>{iconRule(storyType)}</i>
  </span>
);

StoryIcon.propTypes = {
  storyType: PropTypes.string.isRequired,
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

export const StoryTitle = ({ title, ownedByInitials, ownedByName }) => (
  <div className="Story__title">
    {title}
    <abbr
      className="Story__initials"
      title={ownedByName}
    >
      {ownedByInitials}
    </abbr>
  </div>
);

StoryTitle.propTypes = {
  title: PropTypes.string.isRequired,
  ownedByName: PropTypes.string,
  ownedByInitials: PropTypes.string,
};

const StoryInfo = ({ title, labels, ownedByName, ownedByInitials }) => (
  <div className="Story__info">
    <StoryLabels labels={labels} />
    <StoryTitle title={title} ownedByInitials={ownedByInitials} ownedByName={ownedByName} />
  </div>
);

StoryInfo.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.string,
};

StoryInfo.defaultProps = {
  labels: '',
};

const classNameStory = (storyType, estimate) => classname (
  'Story',
  {
    'Story--unestimated': isStoryNotEstimated(storyType, estimate),
    'Story--estimated': !isStoryNotEstimated(storyType, estimate),
    'Story--release' : isRelease(storyType)
  }
);

const StoryItem = ({
  title,
  storyType,
  estimate,
  labels,
  state,
  description,
  ownedByInitials,
  ownedByName,
  requestedByName,
  createdAt,
  notes
}) => (
  <div className={classNameStory(storyType, estimate)}>
    <StoryPopover
      description={description}
      notes={notes}
      createdAt={createdAt}
      title={title}
      storyType={storyType}
      requestedByName={requestedByName}
    >
      <div className='Story__icons-block'>
        <StoryIcon storyType={storyType} />
        <StoryEstimate estimate={estimate} />
        <StoryDescriptionIcon description={description}/>
      </div>
    </StoryPopover>

    <StoryInfo title={title} labels={labels} ownedByInitials={ownedByInitials} ownedByName={ownedByName} />
    <StateActions storyType={storyType} estimate={estimate} state={state}/>
  </div>
);

StoryItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  storyType: PropTypes.string.isRequired,
  labels: PropTypes.any,
  state: PropTypes.string.isRequired,
  ownedByInitials: PropTypes.string,
  ownedByName: PropTypes.string,
  requestedByName: PropTypes.string,
  createdAt: PropTypes.string,
  notes: PropTypes.array,
};

StoryItem.defaultProps = {
  description: '',
};

export default StoryItem;
