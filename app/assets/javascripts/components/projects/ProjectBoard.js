import React from 'react';
import { connect } from 'react-redux';
import { fetchProjectBoard } from 'actions/projectBoard';
import Column from '../Columns/ColumnItem';

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
          title={I18n.t('projects.show.chilly_bin')}
          stories={this.props.columns.chillyBin.stories}
        />
        <Column
          title={I18n.t('projects.show.backlog_in_progress')}
          stories={this.props.columns.backlog.stories}
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
