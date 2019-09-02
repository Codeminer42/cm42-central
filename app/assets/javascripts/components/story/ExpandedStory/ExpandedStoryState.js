import React from 'react';
import PropTypes from 'prop-types';
import * as Story from '../../../models/beta/story';
import { editingStoryPropTypesShape, isUnestimatedFeature } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

const handleState = (story) => {
  if (story._editing.state === "unscheduled" && typeof story._editing.estimate === "number") return "unstarted";
  if (story._editing.state === "unstarted" && isUnestimatedFeature(story._editing)) return "unscheduled";
  return story._editing.state;
};

const ExpandedStoryState = ({ story, onEdit, disabled }) =>
  <ExpandedStorySection
    title={I18n.t('activerecord.attributes.story.state')}
  >
    <select
      value={handleState(story)}
      className="form-control input-sm"
      onChange={(event) => onEdit(event.target.value)}
      disabled={disabled || isUnestimatedFeature(story._editing)}
    >
      {
        Story.states.map((state) => (
          <option value={state} key={state}>
            {I18n.t(`story.state.${state}`)}
          </option>
        ))
      }
    </select>
  </ExpandedStorySection>

ExpandedStoryState.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryState;
