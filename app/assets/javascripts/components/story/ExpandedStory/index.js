import React from 'react';
import PropTypes from 'prop-types';
import ExpandedStoryControls from './ExpandedStoryControls';
import ExpandedStoryDefault from './ExpandedStoryDefault';
import ExpandedStoryRelease from './ExpandedStoryRelease';
import { editStory, saveStory, deleteStory, cloneStory, showHistory } from '../../../actions/story';
import { connect } from 'react-redux';
import * as Story from '../../../models/beta/story';
import ProjectPropTypes from '../../shapes/project';

export class ExpandedStory extends React.Component {
  constructor(props) {
    super(props);

    this.titleRef = React.createRef();
  }

  componentDidMount() {
    this.titleRef.current.focus();
  }

  render() {
    const {
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
    } = this.props;

    const loading = story._editing.loading ? "Story__enable-loading" : "";
    const disabled = !Story.canEdit(story);

    return (
      <div
        className={`Story Story--expanded ${loading} ${className}`}
        title={title}
      >
        <div className="Story__loading"></div>

        {
          Story.isRelease(story._editing)
            ? <ExpandedStoryRelease
              story={story}
              titleRef={this.titleRef}
              onEdit={(newAttributes) => editStory(story.id, newAttributes, from)}
              onClone={cloneStory}
              disabled={disabled}
            />
            : <ExpandedStoryDefault
              story={story}
              titleRef={this.titleRef}
              onEdit={(newAttributes) => editStory(story.id, newAttributes, from)}
              project={project}
              onClone={cloneStory}
              showHistory={showHistory}
              disabled={disabled}
            />
        }

        <ExpandedStoryControls
          onCancel={onToggle}
          isDirty={story._editing._isDirty || false}
          onSave={() => saveStory(story.id, project.id, from)}
          onDelete={() => deleteStory(story.id, project.id, from)}
          canSave={Story.canSave(story)}
          canDelete={Story.canDelete(story)}
          disabled={disabled}
        />
      </div >
    );
  }
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
