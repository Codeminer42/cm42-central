import React from 'react';
import PropTypes from 'prop-types';
import SelectUser from '../select_user/SelectUser';

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
  story: PropTypes.shape({
    _editing: PropTypes.shape({
      requestedById: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
    })
  }),
  onEdit: PropTypes.func.isRequired
}

export default ExpandedStoryRequestBy;
