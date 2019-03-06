import React from "react";
import { connect } from "react-redux";
import { fetchProjectBoard } from "actions/projectBoard";
import Column from "../Columns/ColumnItem";
import Stories from "../stories/Stories";
import Sprints from "../stories/Sprints";
import { getColumns } from "../../selectors/columns";
import * as Columns from '../../models/beta/column';
import { createStory } from '../../actions/story';
import AddStoryButton from '../story/AddStoryButton';
import * as Story from 'libs/beta/constants';

class ProjectBoard extends React.Component {
  componentWillMount() {
    this.props.fetchProjectBoard(this.props.projectId);
  }

  render() {
    if (!this.props.projectBoard.isFetched) {
      return <b>Loading</b>;
    }

    const { createStory } = this.props;

    return (
      <div className="ProjectBoard">
        <Column title={I18n.t("projects.show.chilly_bin")}
          renderAction={() =>
            <AddStoryButton
              onAdd={() => createStory({
                state: Story.status.UNSCHEDULED
              })}
            />
          }
        >
          <Stories stories={this.props.chillyBinStories} />
        </Column>

        <Column
          title={`${I18n.t("projects.show.backlog")} /
          ${I18n.t("projects.show.in_progress")}`}
          renderAction={() =>
            <AddStoryButton
              onAdd={() => createStory({
                state: Story.status.UNSTARTED
              })}
            />}
        >
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
    column: Columns.CHILLY_BIN,
    stories
  }),
  backlogSprints: getColumns({
    column: Columns.BACKLOG,
    stories,
    project
  }),
  doneSprints: getColumns({
    column: Columns.DONE,
    pastIterations
  })
});

const mapDispatchToProps = {
  fetchProjectBoard,
  createStory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectBoard);
