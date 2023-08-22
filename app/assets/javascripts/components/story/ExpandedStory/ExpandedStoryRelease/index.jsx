import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ExpandedStoryTitle from '../ExpandedStoryTitle';
import ExpandedStoryType from '../ExpandedStoryType';
import ExpandedStoryReleaseDate from './ExpandedStoryReleaseDate';
import ExpandedStoryDescription from '../ExpandedStoryDescription';
import ExpandedStoryHistoryLocation from '../ExpandedStoryHistoryLocation';
import { editingStoryPropTypesShape, isNew } from '../../../../models/beta/story';

const ExpandedStoryRelease = ({
  story,
  titleRef,
  onEdit,
  onClone,
  disabled
}) =>
  <Fragment>
    {
      !isNew(story)
        ? <ExpandedStoryHistoryLocation
          story={story}
          onClone={() => onClone(story._editing)}
        />
        : null
    }

    <ExpandedStoryTitle
      story={story}
      titleRef={titleRef}
      onEdit={(title) => onEdit({ title })}
      disabled={disabled}
    />

    <ExpandedStoryType
      story={story}
      onEdit={(storyType) => onEdit({ storyType })}
      disabled={disabled}
    />

    <ExpandedStoryReleaseDate
      story={story}
      onEdit={(releaseDate) => onEdit({ releaseDate })}
      disabled={disabled}
    />

    <ExpandedStoryDescription
      story={story}
      onEdit={(description) => onEdit({ description })}
      disabled={disabled}
    />
  </Fragment>

ExpandedStoryRelease.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  onClone: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryRelease;
