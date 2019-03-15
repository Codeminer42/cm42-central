import React from 'react';
import PropTypes from 'prop-types';
import SelectUser from '../select_user/SelectUser';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

const ExpandedStoryOwnedBy = ({ users, story, onEdit }) =>
  <ExpandedStorySection
    title={I18n.t('activerecord.attributes.story.owned_by')}
  >
    <SelectUser
      users={users}
      selectedUserId={story._editing.ownedById}
      onEdit={onEdit}
    />
  </ExpandedStorySection>

ExpandedStoryOwnedBy.propTypes = {
  users: PropTypes.array.isRequired,
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired
}

export default ExpandedStoryOwnedBy;
