import React from 'react';
import PropTypes from 'prop-types';
import SelectUser from '../select_user/SelectUser';

export default ExpandedStoryRequestBy = ({ users, story, onEdit }) => (
  <div className="Story__section">
    <div className="Story__section-title">
      { I18n.translate('activerecord.attributes.story.requested_by') }
    </div>
    <SelectUser
      users={users}
      userId={story._editing.requestedById}
      onEdit={onEdit}
    />
  </div>
);

ExpandedStoryRequestBy.PropTypes = {
  users: PropTypes.array.isRequired,
  story: PropTypes.shape({
    _editing: PropTypes.shape({
      requestedById: PropTypes.number.isRequired,
    })
  }),
  onEdit: PropTypes.func.isRequired
}
