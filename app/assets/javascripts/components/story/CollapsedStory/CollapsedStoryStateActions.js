import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStoryEstimateButton from './CollapsedStoryEstimateButton';
import CollapsedStoryStateButton from './CollapsedStoryStateButton';
import { isStoryNotEstimated, getNextState, storyTransitions } from '../../../models/beta/story';
import { status } from '../../../libs/beta/constants';

const StoryActionFor = (state) => StateAction[state] || StateAction.unstarted;

const StateAction = {
  [status.STARTED]  : ["finish"],
  [status.FINISHED] : ["deliver"],
  [status.DELIVERED]: ["accept", "reject"],
  [status.REJECTED] : ["restart"],
  [status.ACCEPTED] : [],
  [status.UNSTARTED]: ["start"]
};

class CollapsedStoryStateActions extends React.Component {
  constructor(props) {
    super(props);

    this.confirmTransition = this.confirmTransition.bind(this);
  }

  disableToggle(event) {
    event.stopPropagation();
  }

  confirmTransition(action, update) {
    if (this.needConfirmation(action) && !window.confirm(
      I18n.t('story.definitive_sure', { action })
    )) {
      return;
    }

    update();
  }

  needConfirmation(action) {
    return action === storyTransitions.ACCEPT || action === storyTransitions.REJECT;
  }

  render() {
    const { story, onUpdate } = this.props;

    return (
      <div className='Story__actions' onClick={this.disableToggle}>
        {
          isStoryNotEstimated(story.storyType, story.estimate) ?
            <CollapsedStoryEstimateButton
              onUpdate={((estimate) => onUpdate({ estimate }))}
            />
            : StoryActionFor(story.state).map((stateAction) =>
              <CollapsedStoryStateButton
                action={stateAction}
                key={stateAction}
                onUpdate={() => {
                  this.confirmTransition(stateAction, () => {
                    onUpdate({ state: getNextState(story.state, stateAction) })
                  })
                }}
              />
            )
        }
      </div>
    );
  }
};

CollapsedStoryStateActions.propTypes = {
  story: PropTypes.object.isRequired
};

export default CollapsedStoryStateActions;
