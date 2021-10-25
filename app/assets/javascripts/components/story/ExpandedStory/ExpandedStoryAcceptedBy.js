import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

import { getHistory } from '../../../models/beta/story';
import { findById } from '../../../models/beta/user';

const ExpandedStoryAcceptedBy = ({ users, story }) => {
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    async function fetchData() {
      const history = await getHistory(story.id, story.projectId, users);
      const userId = history[0].activity["user_id"]
      const user = await findById(users, userId);
      setUserInfo(user)
    }

    fetchData()
  }, [story]);

  return (
      <ExpandedStorySection
      title={I18n.t('activerecord.attributes.story.accepted_by')}
    >
      <input
        value={userInfo.name || "----" }
        className="form-control input-sm"
        readOnly={true}
      />
    </ExpandedStorySection>
  );

}

ExpandedStoryAcceptedBy.propTypes = {
  users: PropTypes.array.isRequired,
  story: editingStoryPropTypesShape.isRequired
}

export default ExpandedStoryAcceptedBy;
