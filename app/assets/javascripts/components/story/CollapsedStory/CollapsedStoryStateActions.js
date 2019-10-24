import React from 'react';
import CollapsedStoryEstimateButton from './CollapsedStoryEstimateButton';
import CollapsedStoryStateButton from './CollapsedStoryStateButton';
import {
  isStoryNotEstimated, getNextState,
  storyTransitions, storyPropTypesShape,
  isRelease, isAccepted
} from '../../../models/beta/story';
import { status } from '../../../libs/beta/constants';

const StoryActionFor = (state) => StateAction[state] || StateAction.unstarted;

const StateAction = {
  [status.STARTED]: ["finish"],
  [status.FINISHED]: ["deliver"],
  [status.DELIVERED]: ["accept", "reject"],
  [status.REJECTED]: ["restart"],
  [status.ACCEPTED]: [],
  [status.UNSTARTED]: ["start"],
  [status.RELEASE]: ["release"]
};

class CollapsedStoryStateActions extends React.Component {
  constructor(props) {
    super(props);
  }

  disableToggle(event) {
    event.stopPropagation();
  }

  getStoryState(story) {
    return isRelease(story) && !isAccepted(story)
      ? status.RELEASE
      : story.state;
  }

  render() {
    const { story, onUpdate } = this.props;
    const state = this.getStoryState(story);

    return (
      <div className='Story__actions' onClick={this.disableToggle}>
        {
          isStoryNotEstimated(story.storyType, story.estimate) ?
            <CollapsedStoryEstimateButton
              onUpdate={((estimate) => onUpdate({ estimate }))}
            />
            : StoryActionFor(state).map((stateAction) =>
              <CollapsedStoryStateButton
                action={stateAction}
                key={stateAction}
                onUpdate={() => onUpdate({ state: getNextState(story.state, stateAction) })}
              />
            )
        }
      </div>
    );
  }
};

CollapsedStoryStateActions.propTypes = {
  story: storyPropTypesShape
};

export default CollapsedStoryStateActions;
