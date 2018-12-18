import React from 'react';
import PropTypes from 'prop-types';
import { types } from '../../../models/beta/story';

export const ExpandedStoryType = (props) => {
  const { story, onEdit } = props;

  return (
    <div className="Story__section">
      <div className="Story__section-title">
        { I18n.translate('activerecord.attributes.story.story_type') }
      </div>

      <select
        value={story._editing.storyType}
        className="form-control input-sm"
        onChange={(event) => onEdit({ storyType: event.target.value })}
      >
        {
          types.map((value) => (
            <option value={value} key={value}>
              { value }
            </option>
          ))
        }
      </select>
    </div>
  );
};

ExpandedStoryType.propTypes = {
  story: PropTypes.object
};

export default ExpandedStoryType;
