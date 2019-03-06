import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isFeature, editingStoryPropTypesShape } from '../../../models/beta/story';
import { projectPropTypesShape } from '../../../models/beta/project';

export const ExpandedStoryEstimate = (props) => {
  const { project, story, onEdit } = props;

  return (
    <div className="Story__section">
      <div className="Story__section-title">
        { I18n.t('activerecord.attributes.story.estimate') }
      </div>

      <select
        value={story._editing.estimate}
        className="form-control input-sm"
        onChange={(event) => onEdit({ estimate: parseInt(event.target.value) })}
        disabled={!isFeature(story._editing)}
      >
        <option value=''>
          { I18n.t('story.no_estimate') }
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

ExpandedStoryEstimate.propTypes = {
  project: projectPropTypesShape.isRequired,
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(
  mapStateToProps
)(ExpandedStoryEstimate);
