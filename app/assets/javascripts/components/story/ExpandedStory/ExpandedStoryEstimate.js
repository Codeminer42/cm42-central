import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isFeature } from '../../../models/beta/story';

export class ExpandedStoryEstimate extends React.Component {
  editStory(event) {
    const newValue = event.target.value;
    
    this.props.onEdit({ estimate: newValue });
  };

  render() {
    const { project, story } = this.props;

    return (
      <div className="Story__section">
        <div className="Story__section-title">
          { I18n.translate('activerecord.attributes.story.estimate') }
        </div>

        <select
          defaultValue={story.estimate}
          className="form-control input-sm"
          onChange={(event) => this.editStory(event)}
          disabled={!isFeature(story)}
        >
          <option value=''>
            { I18n.translate('story.no_estimate') }
          </option>
          {
            project.pointValues.map((value) => (
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

ExpandedStoryEstimate.propTypes = {
  project: PropTypes.object,
  story: PropTypes.object
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(
  mapStateToProps,
  null
)(ExpandedStoryEstimate);
