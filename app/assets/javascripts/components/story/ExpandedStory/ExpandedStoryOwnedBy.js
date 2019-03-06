import React from 'react';
import PropTypes from 'prop-types';
import SelectUser from '../select_user/SelectUser';
import { editingStoryPropTypesShape } from '../../../models/beta/story';

const ExpandedStoryOwnedBy = ({ users, story, onEdit }) => (
  <div className="Story__section">
    <div className="Story__section-title">
      {I18n.t('activerecord.attributes.story.owned_by')}
    </div>
    <SelectUser
      users={users}
      selectedUserId={story._editing.ownedById}
      onEdit={onEdit}
    />
  </div>
);

ExpandedStoryOwnedBy.propTypes = {
  users: PropTypes.array.isRequired,
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired
}

export default ExpandedStoryOwnedBy;
