import React from "react";
import { connect } from "react-redux";
import { fetchProjectBoard } from "actions/projectBoard";
import Column from "../Columns/ColumnItem";
import Stories from "../stories/Stories";
import Sprints from "../stories/Sprints";

class ProjectBoard extends React.Component {
  componentWillMount() {
    this.props.fetchProjectBoard(this.props.projectId);
  }

  render() {
    if (!this.props.projectBoard.isFetched) {
      return <b>Loading</b>;
    }

    return (
      <div className="ProjectBoard">
        <Column title={I18n.t("projects.show.chilly_bin")}>
          <Stories stories={this.props.columns.chillyBin.stories} />
        </Column>
        
        <Column
          title={`${I18n.t("projects.show.backlog")} /
          ${I18n.t("projects.show.in_progress")}`}>
          <Sprints
            sprints={this.props.columns.backlog.sprints}
          />
        </Column>

        <Column 
          title={I18n.t("projects.show.done")}>
          <Sprints
            sprints={this.props.columns.done.sprints}
          />
        </Column>
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
  columns
});

const mapDispatchToProps = {
  fetchProjectBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectBoard);
