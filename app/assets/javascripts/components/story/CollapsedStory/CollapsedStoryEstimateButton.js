import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

export const CollapsedStoryEstimateButton = (props) => (
  <div className="Story__estimate-box">
    {
      props.project.pointValues.map((value, index) => (
        <span className="Story__estimate" key={`estimate-${value}`} data-value={value}>
          { value }
        </span>
      ))
    }
  </div>
)

CollapsedStoryEstimateButton.propTypes = {
  project: PropTypes.object,
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(
  mapStateToProps
)(CollapsedStoryEstimateButton);
