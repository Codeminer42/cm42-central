/* eslint react/prop-types:"off" */
import React from 'react';
import { connect } from 'react-redux';
import { fetchProjectBoard } from 'actions/projectBoard';

class ProjectBoard extends React.Component {
  componentWillMount() {
    this.props.fetchProjectBoard(this.props.projectId);
  }

  render() {
    if (!this.props.projectBoard.isFetched) {
      return <b>Loading</b>;
    }

    return (
      <div>{this.props.project.name}</div>
    );
  }
}

const mapStateToProps = ({
  projectBoard, project, users, stories,
}) => ({
  projectBoard,
  project,
  users,
  stories,
});

const mapDispatchToProps = {
  fetchProjectBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectBoard);
