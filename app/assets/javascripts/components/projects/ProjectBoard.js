import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchProjectBoard, toggleColumn, reverseColumns } from "actions/projectBoard";
import { fetchPastStories } from "actions/pastIterations";
import Column from "../Columns/ColumnItem";
import History from "../stories/History";
import { getColumns } from "../../selectors/columns";
import { CHILLY_BIN, DONE, BACKLOG } from '../../models/beta/column';
import { canCloseColumn } from '../../models/beta/projectBoard';
import { createStory, closeHistory, dragDropStory } from '../../actions/story';
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
import { DragDropContext } from 'react-beautiful-dnd';

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
  toggleColumn,
  reverseColumns
}) => {
  if (!projectBoard.isFetched) {
    return <ProjectLoading data-id="project-loading" />;
  }

  const [newChillyBinStories, setNewChillyBinStories] = useState();
  const [newBacklogSprints, setNewBacklogSprints] = useState();

  useEffect(() => {
    setNewBacklogSprints(backlogSprints)
  }, [backlogSprints]);

  useEffect(() => {
    setNewChillyBinStories(chillyBinStories);
  }, [chillyBinStories]);

  useEffect(() => {
    fetchProjectBoard(projectId)
  }, [fetchProjectBoard, projectId]);

  const calculatePosition = (aboveStory, bellowStory) => {
    if (bellowStory === undefined) return (Number(aboveStory.position) + 1);
    if (aboveStory === undefined) return (Number(bellowStory.position) - 1);
    return (Number(bellowStory.position) + Number(aboveStory.position)) / 2;
  }

  const getNewPosition = (destinatitonIndex, sourceIndex, storiesArray, isSameColumn, storyType) => {
    //TODO: remove this second condition later
    if (!isSameColumn && storyType !== 'feature') {
      return calculatePosition(storiesArray[destinatitonIndex - 1], storiesArray[destinatitonIndex]);
    }
    if (sourceIndex > destinatitonIndex) {
      return calculatePosition(storiesArray[destinatitonIndex - 1], storiesArray[destinatitonIndex]);
    }
    return calculatePosition(storiesArray[destinatitonIndex], storiesArray[destinatitonIndex + 1]);
  }

  const getArray = column => column === 'chillyBin' ? chillyBinStories : backlogSprints[0].stories;

  const getState = column => column === 'chillyBin' ? status.UNSCHEDULED : status.UNSTARTED

  const isSameColumn = (sourceColumn, destinationColumn) => sourceColumn === destinationColumn;

  const moveTaskToSameColum = (stories, sourceIndex, destinationIndex) => {
    const newStories = stories;
    const [removed] = newStories.splice(sourceIndex, 1);
    newStories.splice(destinationIndex, 0, removed);
    return [...newStories];
  }

  const moveTaskToAnotherColumn = (sourceArray, destinationArray, source, destination) => {
    const newSourceArray = sourceArray;
    const [removed] = newSourceArray.splice(source.index, 1);
    const newDestinationArray = destinationArray;
    newDestinationArray.splice(destination.index, 0, removed);
    return setNewColumns([...newDestinationArray], source.droppableId);
  }

  const getNewSprints = (newStories) => newBacklogSprints.map((sprint, index) => index === 0 ? { ...sprint, stories: newStories } : sprint)

  const setNewColumns = (newDestinationArray, sourceColumn) => {
    if (sourceColumn === 'backlog') {
      return setNewChillyBinStories(newDestinationArray);
    }
    return setNewBacklogSprints(getNewSprints(newDestinationArray));
  }

  const isEqualToColumn = column => destination.droppableId === column && source.droppableId === column

  const onDragEnd = result => {
    const { destination, source } = result;
    const destinationArray = getArray(destination.droppableId); // stories of destination column
    const sourceArray = getArray(source.droppableId); // stories of source column
    const isSameColumn = isSameColumn(source.droppableId, destination.droppableId);
    const isSameColumn = source.droppableId === destination.droppableId;
    const dragStory = sourceArray[source.index];

    if (!destination) {
      return;
    }

    if (isSameColumn && source.index === destination.index) {
      return;
    }

    const newPosition = getNewPosition(destination.index, source.index, destinationArray, isSameColumn, dragStory.storyType);

    // Changing the column array order
    if (isEqualToColumn('chillyBin')) {
      setNewChillyBinStories(moveTaskToSameColum(newChillyBinStories, source.index, destination.index));
    }

    if (isEqualToColumn('backlog')) {
      const newColumn = moveTaskToSameColum(newBacklogSprints[0].stories, source.index, destination.index);
      setNewBacklogSprints(getNewSprints(newColumn));
    }

    if (!isSameColumn) {
      moveTaskToAnotherColumn(sourceArray, destinationArray, source, destination);
    }

    // Persisting the new array order 
    // Moving to same column
    if (isSameColumn) {
      return dragDropStory(dragStory.id, dragStory.projectId, { position: newPosition });
    }

    // Moving to a different column
    const newState = getState(destination.droppableId);
    return dragDropStory(dragStory.id, dragStory.projectId, { position: newPosition, state: newState });
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
  stories,
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
  dragDropStory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectBoard);

