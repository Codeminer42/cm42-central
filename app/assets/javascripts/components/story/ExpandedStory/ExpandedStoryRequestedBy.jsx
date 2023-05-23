import React from 'react';
import PropTypes from 'prop-types';
import SelectUser from '../select_user/SelectUser';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

const ExpandedStoryRequestedBy = ({ users, story, onEdit, disabled }) =>
  <ExpandedStorySection
    title={I18n.t('activerecord.attributes.story.requested_by')}
  >
    <SelectUser
      users={users}
      selectedUserId={story._editing.requestedById}
      onEdit={onEdit}
      disabled={disabled}
    />
  </ExpandedStorySection>

ExpandedStoryRequestedBy.propTypes = {
  users: PropTypes.array.isRequired,
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
}

export default ExpandedStoryRequestedBy;
