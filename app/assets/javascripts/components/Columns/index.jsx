import React from "react";
import Column from "./ColumnItem";
import PropTypes from "prop-types";
import Stories from "../stories/Stories";
import Sprints from "../stories/Sprints";
import AddStoryButton from "../story/AddStoryButton";
import { order } from '../../models/beta/column';
import { status } from "../../libs/beta/constants";

const Columns = ({
  canClose,
  chillyBinStories,
  backlogSprints,
  doneSprints,
  fetchPastStories,
  toggleColumn,
  createStory,
  visibleColumns,
  reverse
}) => {
  const columns = [
    {
      title: I18n.t("projects.show.chilly_bin"),
      renderAction: () => (
        <AddStoryButton
          onAdd={() =>
            createStory({
              state: status.UNSCHEDULED
            })
          }
        />
      ),
      children: (
        <Stories
          stories={chillyBinStories}
          columnId="chillyBin"
          isDropDisabled={false}
        />
      ),
      visible: visibleColumns.chillyBin,
      onClose: () => toggleColumn("chillyBin")
    },
    {
      title: `${I18n.t("projects.show.backlog")} / ${I18n.t(
        "projects.show.in_progress"
      )}`,
      renderAction: () => (
        <AddStoryButton
          onAdd={() =>
            createStory({
              state: status.UNSTARTED
            })
          }
        />
      ),
      children: (
        <Sprints
          sprints={backlogSprints}
          columnId="backlog"
        />
      ),
      visible: visibleColumns.backlog,
      onClose: () => toggleColumn("backlog")
    },
    {
      title: I18n.t("projects.show.done"),
      children: (
        <Sprints
          sprints={doneSprints}
          fetchStories={fetchPastStories}
          columnId="done"
        />
      ),
      visible: visibleColumns.done,
      onClose: () => toggleColumn("done")
    }
  ];

  return order(columns, reverse).map(column => (
    <Column
      title={column.title}
      renderAction={column.renderAction}
      key={column.title}
      visible={column.visible}
      onClose={column.onClose}
      canClose={canClose}
    >
      {column.children}
    </Column>
  ));
};

Columns.propTypes = {
  canClose: PropTypes.bool.isRequired,
  chillyBinStories: PropTypes.array.isRequired,
  backlogSprints: PropTypes.array.isRequired,
  doneSprints: PropTypes.array.isRequired,
  fetchPastStories: PropTypes.func.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  createStory: PropTypes.func.isRequired,
  visibleColumns: PropTypes.object.isRequired,
  reverse: PropTypes.bool.isRequired
};

export default Columns;
