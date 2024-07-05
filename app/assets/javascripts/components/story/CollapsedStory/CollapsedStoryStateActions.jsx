import React from 'react';
import CollapsedStoryEstimateButton from './CollapsedStoryEstimateButton';
import CollapsedStoryStateButton from './CollapsedStoryStateButton';
import {
  isStoryNotEstimated,
  getNextState,
  isRelease,
  isAccepted,
} from '../../../models/beta/story';
import StoryPropTypes from '../../shapes/story';
import { status } from '../../../libs/beta/constants';

const StoryActionFor = state => StateAction[state] || StateAction.unstarted;

const StateAction = {
  [status.STARTED]: ['finish'],
  [status.FINISHED]: ['deliver'],
  [status.DELIVERED]: ['accept', 'reject'],
  [status.REJECTED]: ['restart'],
  [status.ACCEPTED]: [],
  [status.UNSTARTED]: ['start'],
  [status.RELEASE]: ['release'],
};

const CollapsedStoryStateActions = ({ story, onUpdate }) => {
  const disableToggle = event => event.stopPropagation();

  const getStoryState = story =>
    isRelease(story) && !isAccepted(story) ? status.RELEASE : story.state;

  return (
    <div className="Story__actions" onClick={disableToggle}>
      {isStoryNotEstimated(story.storyType, story.estimate) ? (
        <CollapsedStoryEstimateButton
          onUpdate={estimate => onUpdate({ estimate })}
        />
      ) : (
        StoryActionFor(getStoryState(story)).map(stateAction => (
          <CollapsedStoryStateButton
            action={stateAction}
            key={stateAction}
            onUpdate={() =>
              onUpdate({ state: getNextState(story.state, stateAction) })
            }
          />
        ))
      )}
    </div>
  );
};

CollapsedStoryStateActions.propTypes = {
  story: StoryPropTypes,
};

export default CollapsedStoryStateActions;
