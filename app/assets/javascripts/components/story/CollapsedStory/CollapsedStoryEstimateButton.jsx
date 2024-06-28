import React from 'react';
import { connect } from 'react-redux';
import ProjectPropTypes from '../../shapes/project';

export const CollapsedStoryEstimateButton = ({ project, onUpdate }) => (
  <div className="Story__estimate-box">
    {project.pointValues.map(value => (
      <span
        className="Story__estimate"
        key={`estimate-${value}`}
        data-value={value}
        onClick={() => onUpdate(value)}
      >
        {value}
      </span>
    ))}
  </div>
);

CollapsedStoryEstimateButton.propTypes = {
  project: ProjectPropTypes.isRequired,
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(CollapsedStoryEstimateButton);
