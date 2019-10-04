import React from "react";
import { connect } from "react-redux";
import {DndProvider} from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import { fetchProjectBoard } from "actions/projectBoard";
import { fetchPastStories } from "actions/pastIterations";
import Column from "../Columns/ColumnItem";
import Stories from "../stories/Stories";
import Sprints from "../stories/Sprints";
import History from "../stories/History";
import { getColumns } from "../../selectors/columns";
import * as Columns from '../../models/beta/column';
import { createStory, closeHistory, dragDropStory} from '../../actions/story';
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

    const { createStory, closeHistory, notifications, removeNotification, history } = this.props;

    return (
      <DndProvider backend={HTML5Backend}>
        <div className="ProjectBoard">
          <Notifications
            notifications={notifications}
            onRemove={removeNotification}
          />

          <Column title={I18n.t("projects.show.chilly_bin")}
            column="chillyBin"
            renderAction={() =>
              <AddStoryButton
                onAdd={() => createStory({
                  state: Story.status.UNSCHEDULED
                })}
              />
            }
          >
            <Stories column="chillyBin" stories={this.props.chillyBinStories} />
          </Column>

          <Column
            title={`${I18n.t("projects.show.backlog")} /
            ${I18n.t("projects.show.in_progress")}`}
            column="backlog"
            renderAction={() =>
              <AddStoryButton
                onAdd={() => createStory({
                  state: Story.status.UNSTARTED
                })}
              />}
          >
            <Sprints
              column="backlog"
              sprints={this.props.backlogSprints}
            />
          </Column>

          <Column
            title={I18n.t("projects.show.done")}
            column="done"
          >
            <Sprints
              sprints={this.props.doneSprints}
              fetchStories={this.props.fetchPastStories}
            />
          </Column>

          {
            history.status !== 'DISABLED' &&
            <Column
              onClose={closeHistory}
              title={[I18n.t("projects.show.history"), "'", history.storyTitle, "'"].join(' ')}
            >
              { history.status === 'LOADED'
                ? <History history={history.activities} />
                : <div className="loading">Loading...</div>
              }
            </Column>
          }
        </div>
      </DndProvider>
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
  removeNotification,
  dragDropStory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectBoard);
