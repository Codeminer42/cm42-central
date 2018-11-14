import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStoryPoints from './CollapsedStoryPoints';
import CollapsedStoryStateButton from './CollapsedStoryStateButton';
import { isStoryNotEstimated } from '../../../rules/story';

const StoryActionFor = (state) => StateAction[state] || StateAction.unstarted;

const StateAction = {
  started: ["finish"],
  finished: ["deliver"],
  delivered: ["accept", "reject"],
  rejected: ["restart"],
  accepted: [],
  unstarted: ["start"]
};

const CollapsedStoryStateActions = ({ storyType, estimate, state }) => (
  <div className='Story__actions'>
    {
      isStoryNotEstimated(storyType, estimate) ?
        <CollapsedStoryPoints />
        : StoryActionFor(state).map((stateAction) =>
          <CollapsedStoryStateButton action={stateAction} key={stateAction} />
        )
    }
  </div>
);

CollapsedStoryStateActions.propTypes = {
  storyType: PropTypes.string.isRequired,
  estimate: PropTypes.number,
  state: PropTypes.string.isRequired
};

CollapsedStoryStateActions.defaultProp = {
  estimate: '-',
};

export default CollapsedStoryStateActions;
