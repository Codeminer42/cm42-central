import React from 'react';
import PropTypes from 'prop-types';

const storyTypes = ['feature', 'bug', 'release', 'chore'];

const ExpandedStoryType = ({ story }) => {
  return (
    <div className="Story__section">
      <div className="Story__section-title">
        { I18n.translate('activerecord.attributes.story.story_type') }
      </div>

      <select defaultValue={story.storyType} className="form-control input-sm">
        {
          storyTypes.map((value) => (
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
