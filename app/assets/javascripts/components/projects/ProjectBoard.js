import React from "react";
import { connect } from "react-redux";
import { fetchProjectBoard } from "actions/projectBoard";
import Column from "../Columns/ColumnItem";
import Stories from "../stories/Stories";
import Sprints from "../stories/Sprints";
import { getColumns } from "../../selectors/columns";
import actionTypes from "../../actions/actionTypes";

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
          <Stories stories={this.props.chillyBinStories} />
        </Column>

        <Column
          title={`${I18n.t("projects.show.backlog")} /
          ${I18n.t("projects.show.in_progress")}`}>
          <Sprints
            sprints={this.props.backlogSprints}
          />
        </Column>

        <Column
          title={I18n.t("projects.show.done")}>
          <Sprints
            sprints={this.props.doneSprints}
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
  pastIterations
}) => ({
  projectBoard,
  project,
  users,
  chillyBinStories: getColumns({
    column: actionTypes.COLUMN_CHILLY_BIN,
    stories
  }),
  backlogSprints: getColumns({
    column: actionTypes.COLUMN_BACKLOG,
    stories,
    project
  }),
  doneSprints: getColumns({
    column: actionTypes.COLUMN_DONE,
    pastIterations
  })
});

const mapDispatchToProps = {
  fetchProjectBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectBoard);
