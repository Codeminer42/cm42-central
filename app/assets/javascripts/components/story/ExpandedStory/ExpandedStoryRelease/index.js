import React, { Fragment } from 'react';
import ExpandedStoryReleaseDate from './ExpandedStoryReleaseDate';
import ExpandedStoryTitle from '../ExpandedStoryTitle';
import ExpandedStoryType from '../ExpandedStoryType';
import ExpandedStoryControls from '../ExpandedStoryControls';
import ExpandedStoryDescription from '../ExpandedStoryDescription';
import PropTypes from 'prop-types';
import { editingStoryPropTypesShape } from '../../../../models/beta/story';

const ExpandedStoryRelease = ({
  story,
  titleRef,
  onCancel,
  isDirty,
  onSave,
  onDelete,
  canSave,
  canDelete,
  onEdit
}) =>
  <Fragment>
    <ExpandedStoryControls
      onCancel={onCancel}
      isDirty={isDirty}
      onSave={onSave}
      onDelete={onDelete}
      canSave={canSave}
      canDelete={canDelete}
    />

    <ExpandedStoryTitle
      story={story}
      titleRef={titleRef}
      onEdit={(title) => onEdit({ title })}
    />

    <ExpandedStoryType story={story}
      onEdit={(storyType) => onEdit({ storyType })}
    />

    <ExpandedStoryReleaseDate
      story={story}
      onEdit={(releaseDate) => onEdit({ releaseDate })}
    />

    <ExpandedStoryDescription
      story={story}
      onEdit={(description) => onEdit({ description })}
    />
  </Fragment>

ExpandedStoryRelease.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDirty: PropTypes.bool.isRequired,
  canSave: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
};

export default ExpandedStoryRelease;
