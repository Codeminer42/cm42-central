import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchProjectBoard, toggleColumn, reverseColumns } from "actions/projectBoard";
import { fetchPastStories } from "actions/pastIterations";
import Column from "../Columns/ColumnItem";
import History from "../stories/History";
import { getColumns } from "../../selectors/columns";
import { CHILLY_BIN, DONE, BACKLOG } from '../../models/beta/column';
import {
  canCloseColumn,
  getNewPosition,
  getNewSprints,
  getNewState,
  moveTask,
  getArray
} from '../../models/beta/projectBoard';
import { closeHistory, dragDropStory } from '../../actions/story';
import { historyStatus } from 'libs/beta/constants';
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
import { DragDropContext } from 'react-beautiful-dnd';

export const ProjectBoard = ({
  fetchProjectBoard,
  projectId,
  projectBoard,
  closeHistory,
  notifications,
  removeNotification,
  history,
  chillyBinStories,
  backlogSprints,
  toggleColumn,
  reverseColumns
}) => {
  if (!projectBoard.isFetched) {
    return <ProjectLoading data-id="project-loading" />;
  }

  const [newChillyBinStories, setNewChillyBinStories] = useState();
  const [newBacklogSprints, setNewBacklogSprints] = useState();

  useEffect(() => {
    setNewBacklogSprints(backlogSprints);
  }, [backlogSprints]);

  useEffect(() => {
    setNewChillyBinStories(chillyBinStories);
  }, [chillyBinStories]);

  useEffect(() => {
    fetchProjectBoard(projectId);
  }, [fetchProjectBoard, projectId]);

  const onDragEnd = ({ source, destination, draggableId }) => {
    const { sprintIndex: sprintDropIndex, columnId: dropColumn } = JSON.parse(destination.droppableId);
    const { sprintIndex: sprintDragIndex, columnId: dragColumn } = JSON.parse(source.droppableId);
    const { index: sourceIndex } = source;
    const { index: destinationIndex} = destination;
    const isSameColumn = dragColumn === dropColumn;
    const destinationArray = getArray(dropColumn, newBacklogSprints, newChillyBinStories, sprintDropIndex); // stories of destination column
    const sourceArray = getArray(dragColumn, newBacklogSprints, newChillyBinStories, sprintDragIndex); // stories of source column
    const dragStory = sourceArray[sourceIndex];

    if (!destination) {
      return;
    }

    if (isSameColumn && sourceIndex === destinationIndex) {
      return;
    }

    const newPosition = getNewPosition(
      destinationIndex,
      sourceIndex,
      destinationArray,
      isSameColumn,
      dragStory.storyType,
    );

    const newStories = moveTask(
      sourceArray,
      destinationArray,
      sourceIndex,
      destinationIndex,
    );

    // Changing the column array order
    if (dropColumn === 'chillyBin') {
      setNewChillyBinStories(newStories);
    }

    if (dropColumn === 'backlog') {
      setNewBacklogSprints(getNewSprints(newStories, newBacklogSprints, sprintDropIndex));
    }

    // Persisting the new array order
    const newState = getNewState(isSameColumn, dropColumn, dragStory.state);
    return dragDropStory(dragStory.id, dragStory.projectId, {
      position: newPosition,
      state: newState,
    });
  }
  
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="ProjectBoard">
        <SprintVelocitySimulation />

        <StorySearch projectId={projectId} loading={projectBoard.search.loading} />

        <SideBar data-id="side-bar" buttons={sideBarButtons} />

        <Notifications
          notifications={notifications}
          onRemove={removeNotification}
          data-id="notifications"
        />

        <Columns {...columnProps} canClose={canCloseColumn(projectBoard)} />

        <SearchResults />

        {
          history.status !== historyStatus.DISABLED &&
            <Column
              onClose={closeHistory}
              title={`${I18n.t('projects.show.history')} '${history.storyTitle}'`}
              data-id="history-column"
              canClose
            >
              { history.status === historyStatus.LOADED
                ? <History history={history.activities} data-id="history" />
                : <ProjectLoading data-id="project-loading" />
              }
            </Column>
        }
      </div>
    </DragDropContext>
  );
}

ProjectBoard.propTypes = {
  projectBoard: ProjectBoardPropTypes.isRequired,
  chillyBinStories: PropTypes.arrayOf(StoryPropTypes),
  doneSprints: PropTypes.array.isRequired,
  backlogSprints: PropTypes.array.isRequired,
  fetchProjectBoard: PropTypes.func.isRequired,
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
  stories,
  notifications
});

const mapDispatchToProps = {
  fetchProjectBoard,
  toggleColumn,
  closeHistory,
  fetchPastStories,
  removeNotification,
  reverseColumns,
  dragDropStory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectBoard);

