import React from 'react';
import PropTypes from 'prop-types';
import SelectUser from '../select_user/SelectUser';
import { canEdit, editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

const ExpandedStoryOwnedBy = ({ users, story, onEdit, disabled }) =>
  <ExpandedStorySection
    title={I18n.t('activerecord.attributes.story.owned_by')}
  >
    <SelectUser
      users={users}
      selectedUserId={story._editing.ownedById}
      onEdit={onEdit}
      disabled={disabled}
    />
  </ExpandedStorySection>

ExpandedStoryOwnedBy.propTypes = {
  users: PropTypes.array.isRequired,
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
}

export default ExpandedStoryOwnedBy;
