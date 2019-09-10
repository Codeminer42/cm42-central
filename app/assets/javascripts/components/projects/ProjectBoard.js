import React from "react";
import { connect } from "react-redux";
import { fetchProjectBoard } from "actions/projectBoard";
import { fetchPastStories } from "actions/pastIterations";
import Column from "../Columns/ColumnItem";
import Stories from "../stories/Stories";
import Sprints from "../stories/Sprints";
import History from "../stories/History";
import { getColumns } from "../../selectors/columns";
import * as Columns from '../../models/beta/column';
import { createStory, closeHistory } from '../../actions/story';
import AddStoryButton from '../story/AddStoryButton';
import * as Story from 'libs/beta/constants';
import PropTypes from 'prop-types';
import { storyPropTypesShape } from '../../models/beta/story';
import { projectBoardPropTypesShape } from '../../models/beta/projectBoard';
import Notifications from '../Notifications';
import { removeNotification } from '../../actions/notifications';

class ProjectBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backLogStories: null,
      chillyBinStories: null,
    };
    this.reorderBackLog = this.reorderBackLog.bind(this);
    this.reorderChillyBin = this.reorderChillyBin.bind(this);
  }

  componentWillMount() {
    this.props.fetchProjectBoard(this.props.projectId);
  }

  reorderBackLog(result) {
    console.log(result)
  };

  reorderChillyBin(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.chillyBinStories || this.props.chillyBinStories[0].stories,
      result.source.index,
      result.destination.index
    );

    this.setState({ chillyBinStories: items });
  };

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

        <DragDropContext>
          <Column title={I18n.t("projects.show.chilly_bin")}
            renderAction={() =>
              <AddStoryButton
                onAdd={() => createStory({
                  state: Story.status.UNSCHEDULED,
                })}
              />
            }
          >
            <Stories stories={this.props.chillyBinStories} />
          </Column>
        </DragDropContext>

        <DragDropContext onDragEnd={this.reorderBackLog}>
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
        </DragDropContext>

        <DragDropContext>
          <Column
            title={I18n.t("projects.show.done")}>
            <Sprints
              sprints={this.props.doneSprints}
              fetchStories={this.props.fetchPastStories}
            />
          </Column>
        </DragDropContext>
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
  closeHistory: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
}

const mapStateToProps = ({
  projectBoard,
  project,
  stories,
  history,
  pastIterations,
  notifications
}) => ({
  projectBoard,
  history,
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
  closeHistory,
  fetchPastStories,
  removeNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectBoard);

