import React from 'react';
import PropTypes from 'prop-types';
import { types } from '../../../models/beta/story'; 

export class ExpandedStoryType extends React.Component {
  render() {
    const { story, onEdit } = this.props;

    return (
      <div className="Story__section">
        <div className="Story__section-title">
          { I18n.translate('activerecord.attributes.story.story_type') }
        </div>

        <select
          defaultValue={story.storyType}
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
};

ExpandedStoryType.propTypes = {
  story: PropTypes.object
};

export default ExpandedStoryType;
