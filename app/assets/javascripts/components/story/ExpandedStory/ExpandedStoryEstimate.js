import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isFeature, editingStoryPropTypesShape } from '../../../models/beta/story';
import { projectPropTypesShape } from '../../../models/beta/project';
import ExpandedStorySection from './ExpandedStorySection';

export const ExpandedStoryEstimate = ({ project, story, onEdit }) =>
  <ExpandedStorySection
    title={I18n.t('activerecord.attributes.story.estimate')}
  >
    <select
      value={story._editing.estimate}
      className="form-control input-sm"
      onChange={(event) => onEdit({ estimate: parseInt(event.target.value) })}
      disabled={!isFeature(story._editing)}
    >
      <option value=''>
        {I18n.t('story.no_estimate')}
      </option>
      {
        project.pointValues.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))
      }
    </select>
  </ExpandedStorySection>

ExpandedStoryEstimate.propTypes = {
  project: projectPropTypesShape.isRequired,
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(
  mapStateToProps
)(ExpandedStoryEstimate);
