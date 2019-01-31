import React from 'react';
import PropTypes from 'prop-types';
import SelectUser from '../select_user/SelectUser';

export default ExpandedStoryOwnedBy = ({ users, story, onEdit }) => (
  <div className="Story__section">
    <div className="Story__section-title">
      {I18n.translate('activerecord.attributes.story.owned_by')}
    </div>
    <SelectUser
      users={users}
      selectedUserId={story._editing.ownedById}
      onEdit={onEdit}
    />
  </div>
);

ExpandedStoryOwnedBy.PropTypes = {
  users: PropTypes.array.isRequired,
  story: PropTypes.shape({
    _editing: PropTypes.shape({
      requestedById: PropTypes.number.isRequired,
    })
  }),
  onEdit: PropTypes.func.isRequired
}
