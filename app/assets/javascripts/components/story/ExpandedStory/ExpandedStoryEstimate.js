import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isFeature } from '../../../models/beta/story';

export class ExpandedStoryEstimate extends React.Component {
  render() {
    const { project, story, onEdit } = this.props;

    return (
      <div className="Story__section">
        <div className="Story__section-title">
          { I18n.translate('activerecord.attributes.story.estimate') }
        </div>

        <select
          defaultValue={story.estimate}
          className="form-control input-sm"
          onChange={(event) => onEdit({ estimate: parseInt(event.target.value) })}
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
  mapStateToProps
)(ExpandedStoryEstimate);
