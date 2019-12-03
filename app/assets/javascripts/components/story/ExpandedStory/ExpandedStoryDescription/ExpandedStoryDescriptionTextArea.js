import React from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import PropTypes from 'prop-types';

const ExpandedStoryDescriptionTextArea = ({
  onEdit,
  disabled,
  description,
  users
}) => {
  const extractMentionData = (({ id, username }) => ({ id, display: username }));
  const formatMention = (_, display) => `@${display} `;
  const mentionableUsers = users.map(extractMentionData);

  return (
    <MentionsInput
      className="edit-description-text"
      onChange={(event) => onEdit(event.target.value)}
      readOnly={disabled}
      value={description}
      data-id="text-area"
      markup="@{{__type__||__id__||__display__}}"
    >
      <Mention
        displayTransform={formatMention}
        data={mentionableUsers}
        type="user"
        trigger="@"
      />
    </MentionsInput>
  )
};

ExpandedStoryDescriptionTextArea.propTypes = {
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  description: PropTypes.string.isRequired
};
  
export default ExpandedStoryDescriptionTextArea;
