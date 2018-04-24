import React from 'react';
import { connect } from 'react-redux';
import { fetchProjectBoard } from 'actions/projectBoard';
import Column from './Column'

class ProjectBoard extends React.Component {
  componentWillMount() {
    this.props.fetchProjectBoard(this.props.projectId);
  }

  render() {
    if(!this.props.projectBoard.isFetched) {
      return <b>Loading</b>;
    }

    return (
      <div className="ProjectBoard">
        <Column
          title="Chilly Bin"
          // stories={this.props.columns.chilly_bin.stories}
          stories={this.props.stories}
        />
        <Column
          title="BackLog"
          stories={this.props.columns.backlog.stories}
        />
         <Column
          title="In Progress"
          stories={this.props.columns.in_progress.stories}
        />
        <Column
          title="Done"
          stories={this.props.columns.done.stories}
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  projectBoard,
  project,
  users,
  stories,
  columns
}) => ({
  projectBoard,
  project,
  users,
  stories,
  columns,
});

const mapDispatchToProps = {
  fetchProjectBoard
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectBoard);
