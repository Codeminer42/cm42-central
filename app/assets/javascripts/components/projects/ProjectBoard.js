import React from "react";
import { connect } from "react-redux";
import { fetchProjectBoard } from "actions/projectBoard";
import { fetchPastStories } from "actions/pastIterations";
import Column from "../Columns/ColumnItem";
import Stories from "../stories/Stories";
import Sprints from "../stories/Sprints";
import { getColumns } from "../../selectors/columns";
import * as Columns from '../../models/beta/column';
import { createStory } from '../../actions/story';
import AddStoryButton from '../story/AddStoryButton';
import * as Story from 'libs/beta/constants';
import PropTypes from 'prop-types';
import { storyPropTypesShape } from '../../models/beta/story';
import { projectBoardPropTypesShape } from '../../models/beta/projectBoard';
import Notifications from '../Notifications';
import { removeNotification } from '../../actions/notifications';

class ProjectBoard extends React.Component {
  componentWillMount() {
    this.props.fetchProjectBoard(this.props.projectId);
  }

  render() {
    if (!this.props.projectBoard.isFetched) {
      return <b>Loading</b>;
    }

    const { createStory, notifications, removeNotification } = this.props;

    return (
      <div className="ProjectBoard">
        <Notifications
          notifications={notifications}
          onRemove={removeNotification}
        />

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
            fetchStories={this.props.fetchPastStories}
          />
        </Column>
      </div>
    );
  }
}

ProjectBoard.propTypes = {
  projectBoard: projectBoardPropTypesShape.isRequired,
  chillyBinStories: PropTypes.arrayOf(storyPropTypesShape),
  doneSprints: PropTypes.array.isRequired,
  backlogSprints: PropTypes.array.isRequired,
  fetchProjectBoard: PropTypes.func.isRequired,
  createStory: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
}

const mapStateToProps = ({
  projectBoard,
  project,
  stories,
  pastIterations,
  notifications
}) => ({
  projectBoard,
  chillyBinStories: getColumns({
    column: Columns.CHILLY_BIN,
    stories
  }),
  backlogSprints: getColumns({
    column: Columns.BACKLOG,
    stories,
    project,
    pastIterations
  }),
  doneSprints: getColumns({
    column: Columns.DONE,
    pastIterations,
    stories
  }),
  notifications
});

const mapDispatchToProps = {
  fetchProjectBoard,
  createStory,
  fetchPastStories
  removeNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectBoard);

