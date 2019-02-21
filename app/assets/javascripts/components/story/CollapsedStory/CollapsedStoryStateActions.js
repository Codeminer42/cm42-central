import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStoryEstimateButton from './CollapsedStoryEstimateButton';
import CollapsedStoryStateButton from './CollapsedStoryStateButton';
import { isStoryNotEstimated } from '../../../models/beta/story';

const StoryActionFor = (state) => StateAction[state] || StateAction.unstarted;

const StateAction = {
  started: ["finish"],
  finished: ["deliver"],
  delivered: ["accept", "reject"],
  rejected: ["restart"],
  accepted: [],
  unstarted: ["start"]
};

class CollapsedStoryStateActions extends React.Component {
  disableToggle(event) {
    event.stopPropagation();
  }

  render() {
    const { story, onUpdate } = this.props;

    return (
      <div className='Story__actions' onClick={this.disableToggle}>
        {
          isStoryNotEstimated(story.storyType, story.estimate) ?
            <CollapsedStoryEstimateButton onUpdate={((estimate) => onUpdate({ estimate }))} />
            : StoryActionFor(story.state).map((stateAction) =>
              <CollapsedStoryStateButton action={stateAction} key={stateAction} />
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
