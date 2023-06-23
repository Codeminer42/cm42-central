import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import ExpandedStoryControls from "./ExpandedStoryControls";
import ExpandedStoryDefault from "./ExpandedStoryDefault";
import ExpandedStoryRelease from "./ExpandedStoryRelease";
import {
  editStory,
  saveStory,
  deleteStory,
  cloneStory,
  showHistory,
} from "../../../actions/story";
import { connect } from "react-redux";
import * as Story from "../../../models/beta/story";
import ProjectPropTypes from "../../shapes/project";

export function ExpandedStory({
  story,
  onToggle,
  editStory,
  saveStory,
  cloneStory,
  showHistory,
  deleteStory,
  project,
  className,
  title,
  from,
}) {
  const titleRef = useRef();

  const loading = story._editing.loading;
  const disabled = !Story.canEdit(story);

  const handleEditStory = (newAttributes) => {
    editStory(story.id, newAttributes, from);
  };

  const handleSaveStory = () => {
    saveStory(story.id, project.id, from);
  };

  const handleDeleteStory = () => {
    deleteStory(story.id, project.id, from);
  };

  useEffect(() => {
    titleRef?.current?.focus();
  }, [titleRef]);

  return (
    <div
      className={classNames(
        "Story Story--expanded",
        { "Story__enable-loading": loading },
        className
      )}
      title={title}
    >
      <div className="Story__loading" />

      <ExpandedStoryControls
        onCancel={onToggle}
        isDirty={story._editing._isDirty || false}
        onSave={handleSaveStory}
        onDelete={handleDeleteStory}
        canSave={Story.canSave(story)}
        canDelete={Story.canDelete(story)}
        disabled={disabled}
      />

      {Story.isRelease(story._editing) ? (
        <ExpandedStoryRelease
          story={story}
          titleRef={titleRef}
          onEdit={handleEditStory}
          onClone={cloneStory}
          disabled={disabled}
        />
      ) : (
        <ExpandedStoryDefault
          story={story}
          titleRef={titleRef}
          onEdit={handleEditStory}
          project={project}
          onClone={cloneStory}
          showHistory={showHistory}
          disabled={disabled}
        />
      )}
    </div>
  );
}

ExpandedStory.propTypes = {
  story: Story.editingStoryPropTypesShape.isRequired,
  editStory: PropTypes.func.isRequired,
  saveStory: PropTypes.func.isRequired,
  cloneStory: PropTypes.func.isRequired,
  showHistory: PropTypes.func.isRequired,
  deleteStory: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  project: ProjectPropTypes.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps, {
  editStory,
  saveStory,
  deleteStory,
  cloneStory,
  showHistory,
})(ExpandedStory);
