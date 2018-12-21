import React from 'react';
import PropTypes from 'prop-types';
import * as Story from '../../../models/beta/story';

const ExpandedStoryState = (props) => {
  const { story, onEdit } = props;

  return (
    <div className="Story__section">
      <div className="Story__section-title">
        { I18n.translate('activerecord.attributes.story.state') }
      </div>

      <select
        value={story._editing.state}
        className="form-control input-sm"
        onChange={(event) => onEdit({ state: event.target.value })}
      >
        {
          Story.states.map((state) => (
            <option value={state} key={state}>
              { I18n.t(`story.state.${state}`) }
            </option>
          ))
        }
      </select>
    </div>
  );
};

ExpandedStoryState.propTypes = {
  story: PropTypes.object
};

export default ExpandedStoryState;
