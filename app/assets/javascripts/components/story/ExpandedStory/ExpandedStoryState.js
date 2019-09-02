import React from 'react';
import PropTypes from 'prop-types';
import * as Story from '../../../models/beta/story';
import { editingStoryPropTypesShape, isUnestimatedFeature } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

const ExpandedStoryState = ({ story, onEdit, disabled }) =>
  <ExpandedStorySection
    title={I18n.t('activerecord.attributes.story.state')}
  >
    <select
      value={story._editing.state}
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
