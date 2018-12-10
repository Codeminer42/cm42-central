import React from 'react';
import PropTypes from 'prop-types';
import { types } from '../../../models/beta/story'; 

export class ExpandedStoryType extends React.Component {
  editStory(event) {
    const newValue = event.target.value;

    this.props.onEdit({ storyType: newValue });
  };

  render() {
    const { story } = this.props;

    return (
      <div className="Story__section">
        <div className="Story__section-title">
          { I18n.translate('activerecord.attributes.story.story_type') }
        </div>

        <select
          defaultValue={story.storyType}
          className="form-control input-sm"
          onChange={(event) => this.editStory(event)}
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
