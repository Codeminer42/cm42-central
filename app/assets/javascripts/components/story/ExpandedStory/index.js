import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ExpandedStoryControls from './ExpandedStoryControls';
import ExpandedStoryDefault from './ExpandedStoryDefault';
import ExpandedStoryRelease from './ExpandedStoryRelease';
import EstimateBadge from '../EstimateBadge';
import { editStory, saveStory, deleteStory, cloneStory, showHistory } from '../../../actions/story';
import { connect } from 'react-redux';
import * as Story from '../../../models/beta/story';
import ProjectPropTypes from '../../shapes/project';
import classname from 'classnames';

export const ExpandedStory = ({
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
  from
}) => {
  const titleRef = useRef();

  useEffect(() => {
    titleRef.current.focus();
  }, [titleRef]);

  const disabled = !Story.canEdit(story);
  const classes = classname(
    'Story Story--expanded',
    {
      'Story__enable-loading': story._editing.loading,
    },
    className
  );

  return (
    <div
      className={classes}
      title={title}
    >
      <div className="Story__loading"></div>

      <EstimateBadge story={story._editing} />

      <ExpandedStoryControls
        onCancel={onToggle}
        isDirty={story._editing._isDirty || false}
        onSave={() => saveStory(story.id, project.id, from)}
        onDelete={() => deleteStory(story.id, project.id, from)}
        canSave={Story.canSave(story)}
        canDelete={Story.canDelete(story)}
        disabled={disabled}
      />

      {
        Story.isRelease(story._editing)
          ? <ExpandedStoryRelease
            story={story}
            titleRef={titleRef}
            onEdit={(newAttributes) => editStory(story.id, newAttributes, from)}
            onClone={cloneStory}
            disabled={disabled}
          />
          : <ExpandedStoryDefault
            story={story}
            titleRef={titleRef}
            onEdit={(newAttributes) => editStory(story.id, newAttributes, from)}
            project={project}
            onClone={cloneStory}
            showHistory={showHistory}
            disabled={disabled}
          />
      }
    </div >
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
  className: PropTypes.string
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(
  mapStateToProps,
  {
    editStory,
    saveStory,
    deleteStory,
    cloneStory,
    showHistory
  }
)(ExpandedStory);
