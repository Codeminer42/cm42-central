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
            state: Story.status.UNSCHEDULED
          })}
        />,
      children: <Stories stories={chillyBinStories} />
    },
    {
      title: `${I18n.t("projects.show.backlog")} / ${I18n.t("projects.show.in_progress")}`,
      renderAction: () =>
        <AddStoryButton
          onAdd={() => createStory({
            state: Story.status.UNSTARTED
          })}
        />,
      children: <Sprints sprints={backlogSprints} />
    },
    {
      title: I18n.t("projects.show.done"),
      children: <Sprints sprints={doneSprints} fetchStories={fetchPastStories} />
    }
  ];

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
          ? 
            <Columns
              data-id="reversed-column"
              columns={columns.reverse()}
            />
          : 
            <Columns
              data-id="normal-column"
              columns={columns}
            />
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

