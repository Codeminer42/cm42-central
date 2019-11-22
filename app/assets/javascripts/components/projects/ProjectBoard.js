import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchProjectBoard } from "actions/projectBoard";
import { fetchPastStories } from "actions/pastIterations";
import Column from "../Columns/ColumnItem";
import History from "../stories/History";
import { getColumns } from "../../selectors/columns";
import * as Columns from '../../models/beta/column';
import { createStory, closeHistory } from '../../actions/story';
import AddStoryButton from '../story/AddStoryButton';
import * as Story from 'libs/beta/constants';
import PropTypes from 'prop-types';
import StoryPropTypes from '../shapes/story';
import ProjectBoardPropTypes from '../shapes/projectBoard';
import Notifications from '../Notifications';
import { removeNotification } from '../../actions/notifications';
import StorySearch from '../search/StorySearch';
import SearchResults from './../search/SearchResults';
import ProjectLoading from './ProjectLoading';
import ProjectOptions from './ProjectOptions';
import NormalColumn from '../Columns/NormalColumns';
import ReversedColumn from '../Columns/ReversedColumns';

const ProjectBoard = ({
  fetchProjectBoard,
  projectId,
  projectBoard,
  createStory, 
  closeHistory,
  notifications, 
  removeNotification, 
  history,
  chillyBinStories,
  backlogSprints,
  doneSprints,
  fetchPastStories
}) => {
  useEffect(() => {
    fetchProjectBoard(projectId)
  }, [fetchProjectBoard, projectId]);

  if (!projectBoard.isFetched) {
    return <ProjectLoading data-id="project-loading" />;
  }

  const chillyBin = {
    title: I18n.t("projects.show.chilly_bin"),
    renderAction: () =>
      <AddStoryButton
        onAdd={() => createStory({
          state: Story.status.UNSCHEDULED
        })}
      />,
    stories: chillyBinStories
  };

  const done = {
    title: I18n.t("projects.show.done"),
    sprints: doneSprints,
    fetchPastStories
  }

  const backlog = {
    title: `${I18n.t("projects.show.backlog")} / ${I18n.t("projects.show.in_progress")}`,
    renderAction: () =>
      <AddStoryButton
        onAdd={() => createStory({
          state: Story.status.UNSTARTED
        })}
      />,
    sprints: backlogSprints
  };

  return (
    <div className="ProjectBoard">
      <StorySearch projectId={projectId} loading={projectBoard.search.loading} />

      <ProjectOptions />

      <Notifications
        notifications={notifications}
        onRemove={removeNotification}
      />

      {
        projectBoard.reverse
          ? <ReversedColumn done={done} chillyBin={chillyBin} backlog={backlog} />
          : <NormalColumn done={done} chillyBin={chillyBin} backlog={backlog} />
      }

      <SearchResults />

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
  );
}

ProjectBoard.propTypes = {
  projectBoard: ProjectBoardPropTypes.isRequired,
  chillyBinStories: PropTypes.arrayOf(StoryPropTypes),
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

