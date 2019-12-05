import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchProjectBoard } from "actions/projectBoard";
import { fetchPastStories } from "actions/pastIterations";
import Column from "../Columns/ColumnItem";
import History from "../stories/History";
import { getColumns } from "../../selectors/columns";
import { CHILLY_BIN, DONE, BACKLOG } from '../../models/beta/column';
import { createStory, closeHistory } from '../../actions/story';
import AddStoryButton from '../story/AddStoryButton';
import { status, historyStatus } from 'libs/beta/constants';
import PropTypes from 'prop-types';
import StoryPropTypes from '../shapes/story';
import ProjectBoardPropTypes from '../shapes/projectBoard';
import Notifications from '../Notifications';
import { removeNotification } from '../../actions/notifications';
import StorySearch from '../search/StorySearch';
import SearchResults from './../search/SearchResults';
import ProjectLoading from './ProjectLoading';
import SideBar from './SideBar';
import Columns from '../Columns/Columns';
import Stories from "../stories/Stories";
import Sprints from "../stories/Sprints";

export const ProjectBoard = ({
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

  const columns = [
    {
      title: I18n.t("projects.show.chilly_bin"),
      renderAction: () =>
        <AddStoryButton
          onAdd={() => createStory({
            state: status.UNSCHEDULED
          })}
        />,
      children: <Stories stories={chillyBinStories} />
    },
    {
      title: `${I18n.t("projects.show.backlog")} / ${I18n.t("projects.show.in_progress")}`,
      renderAction: () =>
        <AddStoryButton
          onAdd={() => createStory({
            state: status.UNSTARTED
          })}
        />,
      children: <Sprints sprints={backlogSprints} />
    },
    {
      title: I18n.t("projects.show.done"),
      children: <Sprints sprints={doneSprints} fetchStories={fetchPastStories} />
    }
  ];

  const columnProps = {
    'data-id': projectBoard.reverse ? 'reversed-column' : 'normal-column',
    columns: projectBoard.reverse ? columns.reverse() : columns
  };

  return (
    <div className="ProjectBoard">
      <StorySearch projectId={projectId} loading={projectBoard.search.loading} />

      <SideBar />

      <Notifications
        notifications={notifications}
        onRemove={removeNotification}
      />

      <Columns {...columnProps} />

      <SearchResults />

      {
        history.status !== historyStatus.DISABLED &&
          <Column
            onClose={closeHistory}
            title={`${I18n.t('projects.show.history')} '${history.storyTitle}'`}
            data-id="history-column"
          >
            { history.status === historyStatus.LOADED
              ? <History history={history.activities} data-id="history" />
              : <ProjectLoading data-id="project-loading" />
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
    column: CHILLY_BIN,
    stories
  }),
  backlogSprints: getColumns({
    column: BACKLOG,
    stories,
    project,
    pastIterations
  }),
  doneSprints: getColumns({
    column: DONE,
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

