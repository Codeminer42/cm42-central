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
  onClone
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
    />

    <ExpandedStoryType
      story={story}
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
  onEdit: PropTypes.func.isRequired,
  onClone: PropTypes.func.isRequired
};

export default ExpandedStoryRelease;
