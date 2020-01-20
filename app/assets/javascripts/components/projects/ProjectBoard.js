import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchProjectBoard, toggleColumn, reverseColumns } from "actions/projectBoard";
import { fetchPastStories } from "actions/pastIterations";
import Column from "../Columns/ColumnItem";
import History from "../stories/History";
import { getColumns } from "../../selectors/columns";
import { CHILLY_BIN, DONE, BACKLOG } from '../../models/beta/column';
import { canCloseColumn } from '../../models/beta/projectBoard';
import { createStory, closeHistory } from '../../actions/story';
import AddStoryButton from '../story/AddStoryButton';
import { status, historyStatus } from 'libs/beta/constants';
import PropTypes from 'prop-types';
import StoryPropTypes from '../shapes/story';
import ProjectBoardPropTypes from '../shapes/projectBoard';
import Notifications from '../Notifications';
import { removeNotification } from '../../actions/notifications';
import StorySearch from '../search/StorySearch';
import SprintVelocitySimulation from '../sprint/SprintVelocitySimulation';
import SearchResults from './../search/SearchResults';
import ProjectLoading from './ProjectLoading';
import SideBar from './SideBar';
import Columns from '../Columns';
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
  fetchPastStories,
  toggleColumn,
  reverseColumns
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
      children: <Stories stories={chillyBinStories} />,
      visible: projectBoard.visibleColumns.chillyBin,
      onClose: () => toggleColumn('chillyBin')
    },
    {
      title: `${I18n.t("projects.show.backlog")} / ${I18n.t("projects.show.in_progress")}`,
      renderAction: () =>
        <AddStoryButton
          onAdd={() => createStory({
            state: status.UNSTARTED
          })}
        />,
      children: <Sprints sprints={backlogSprints} />,
      visible: projectBoard.visibleColumns.backlog,
      onClose: () => toggleColumn('backlog')
    },
    {
      title: I18n.t("projects.show.done"),
      children: <Sprints sprints={doneSprints} fetchStories={fetchPastStories} />,
      visible: projectBoard.visibleColumns.done,
      onClose: () => toggleColumn('done')
    }
  ];

  const sideBarButtons = [
    {
      description: I18n.t('revert_columns_tooltip'),
      onClick: reverseColumns,
      'data-id': 'reverse-button',
      isVisible: projectBoard.reverse,
      icon: 'fas fa-columns'
    },
    {
      description: I18n.t('toggle_column', { column: 'chilly bin' }),
      onClick: () => toggleColumn('chillyBin'),
      'data-id': 'toggle-chilly-bin',
      isVisible: projectBoard.visibleColumns.chillyBin,
      icon: 'fas fa-snowflake'
    },
    {
      description: I18n.t('toggle_column', { column: 'backlog' }),
      onClick: () => toggleColumn('backlog'),
      'data-id': 'toggle-backlog',
      isVisible: projectBoard.visibleColumns.backlog,
      icon: 'fas fa-th-list'
    },
    {
      description: I18n.t('toggle_column', { column: 'done' }),
      onClick: () => toggleColumn('done'),
      'data-id': 'toggle-done',
      isVisible: projectBoard.visibleColumns.done,
      icon: 'fas fa-check-circle'
    }
  ];

    const columnProps = {
      'data-id': projectBoard.reverse ? 'reversed-column' : 'normal-column',
      columns: projectBoard.reverse ? columns.reverse() : columns
    };

  return (
    <div className="ProjectBoard">
      <SprintVelocitySimulation />

      <StorySearch projectId={projectId} loading={projectBoard.search.loading} />

      <SideBar data-id="side-bar" buttons={sideBarButtons} />

      <Notifications
        notifications={notifications}
        onRemove={removeNotification}
        data-id="notifications"
      />

      <Columns {...columnProps} canCloseColumn={canCloseColumn(projectBoard)} />

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
  notifications: PropTypes.array.isRequired,
  reverseColumns: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  removeNotification: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  fetchPastStories: PropTypes.func.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  calculatedSprintVelocity: PropTypes.number,
  sprintVelocity: PropTypes.number,
  simulateSprintVelocity: PropTypes.func,
  revertSprintVelocity: PropTypes.func
};

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
  toggleColumn,
  createStory,
  closeHistory,
  fetchPastStories,
  removeNotification,
  reverseColumns,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectBoard);

