import React from 'react';
import PropTypes from 'prop-types';
import SelectUser from '../select_user/SelectUser';
import { editingStoryPropTypesShape } from '../../../models/beta/story';

const ExpandedStoryRequestBy = ({ users, story, onEdit }) => (
  <div className="Story__section">
    <div className="Story__section-title">
      { I18n.t('activerecord.attributes.story.requested_by') }
    </div>
    <SelectUser
      users={users}
      selectedUserId={story._editing.requestedById}
      onEdit={onEdit}
    />
  </div>
);

ExpandedStoryRequestBy.propTypes = {
  users: PropTypes.array.isRequired,
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired
}

export default ExpandedStoryRequestBy;
