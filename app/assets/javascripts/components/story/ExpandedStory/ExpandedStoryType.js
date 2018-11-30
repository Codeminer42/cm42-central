import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
const storyTypes = ['feature', 'bug', 'release', 'chore']

export const ExpandedStoryType = (props) => {
  const { project } = props;

  return (
    <div></div>
  )
}

ExpandedStoryType.propTypes = {
  project: PropTypes.object
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(
  mapStateToProps,
  null
)(ExpandedStoryType);
