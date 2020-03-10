import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchProjectBoard, toggleColumn, reverseColumns } from "actions/projectBoard";
import { fetchPastStories } from "actions/pastIterations";
import { Column } from "../Columns/ColumnItem";
import History from "../stories/History";
import { getColumns } from "../../selectors/columns";
import { closeHistory, createStory, dragDropStory } from "../../actions/story";
import { CHILLY_BIN, DONE, BACKLOG } from "../../models/beta/column";
import PropTypes from "prop-types";
import {
  canCloseColumn,
  getNewPosition,
  getNewSprints,
  getNewState,
  moveStory,
  getSprintColumn,
  dragStory
} from '../../models/beta/projectBoard';
import { historyStatus, columns } from 'libs/beta/constants';
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
  reverseColumns,
  doneSprints,
  createStory,
  dragDropStory,
  fetchPastStories
}) => {
  const [newChillyBinStories, setNewChillyBinStories] = useState([]);
  const [newBacklogSprints, setNewBacklogSprints] = useState([]);

  useEffect(() => {
    setNewBacklogSprints(backlogSprints);
  }, [setNewBacklogSprints, backlogSprints]);

  useEffect(() => {
    setNewChillyBinStories(chillyBinStories);
  }, [setNewChillyBinStories, chillyBinStories]);

  useEffect(() => {
    fetchProjectBoard(projectId);
  }, [fetchProjectBoard, projectId]);

  if (!projectBoard.isFetched) {
    return <ProjectLoading data-id="project-loading" />;
  }

  const onDragEnd = ({ source, destination }) => {
    if (!destination || !source) return;

    const { sprintIndex: sprintDropIndex, columnId: dropColumn } = JSON.parse(destination.droppableId);
    const { sprintIndex: sprintDragIndex, columnId: dragColumn } = JSON.parse(source.droppableId);
    const { index: sourceIndex } = source;
    const { index: destinationIndex } = destination;
    const isSameColumn = dragColumn === dropColumn;
    const destinationArray = getSprintColumn(dropColumn, newBacklogSprints, newChillyBinStories, sprintDropIndex); // stories of destination column
    const sourceArray = getSprintColumn(dragColumn, newBacklogSprints, newChillyBinStories, sprintDragIndex); // stories of source column
    const dragStory = sourceArray[sourceIndex];

    if (isSameColumn && sourceIndex === destinationIndex) return;
    if (!dropColumn) return;

    const newPosition = getNewPosition(
      destinationIndex,
      sourceIndex,
      destinationArray,
      isSameColumn,
      dragStory.state,
    );

    const newStories = moveStory(
      sourceArray,
      destinationArray,
      sourceIndex,
      destinationIndex,
      isSameColumn,
    );

    // Changing the column array order
    if (dropColumn === columns.CHILLY_BIN) {
      setNewChillyBinStories(newStories);
    }

    if (dropColumn === columns.BACKLOG) {
      setNewBacklogSprints(getNewSprints(newStories, newBacklogSprints, sprintDropIndex));
    }

    // Persisting the new array order
    const newState = getNewState(isSameColumn, dropColumn, dragStory.state);

    return dragDropStory(dragStory.id, dragStory.projectId, {
      position: newPosition,
      state: newState,
    });
  };

  const onDragUpdate = ({ source, destination }) => {
    dragStory(source, destination, newBacklogSprints, setNewBacklogSprints);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div className="ProjectBoard">
        <SprintVelocitySimulation />

        <StorySearch
          projectId={projectId}
          loading={projectBoard.search.loading}
        />

        <SideBar
          data-id="side-bar"
          reverse={projectBoard.reverse}
          visibleColumns={projectBoard.visibleColumns}
          toggleColumn={toggleColumn}
          reverseColumns={reverseColumns}
        />

        <Notifications
          notifications={notifications}
          onRemove={removeNotification}
          data-id="notifications"
        />

        <Columns
          canClose={canCloseColumn(projectBoard)}
          chillyBinStories={newChillyBinStories}
          backlogSprints={newBacklogSprints}
          doneSprints={doneSprints}
          toggleColumn={toggleColumn}
          visibleColumns={projectBoard.visibleColumns}
          createStory={createStory}
          fetchPastStories={fetchPastStories}
          reverse={projectBoard.reverse}
          data-id="columns"
        />

        <SearchResults />

        {
          history.status !== historyStatus.DISABLED &&
          <Column
            onClose={closeHistory}
            title={`${I18n.t('projects.show.history')} '${history.storyTitle}'`}
            data-id="history-column"
            canClose
          >
            {history.status === historyStatus.LOADED
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
  revertSprintVelocity: PropTypes.func,
  createStory: PropTypes.func.isRequired,
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
  closeHistory,
  fetchPastStories,
  removeNotification,
  reverseColumns,
  dragDropStory,
  createStory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectBoard);

