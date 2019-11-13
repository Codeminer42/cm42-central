import React from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import PropTypes from 'prop-types';

const ExpandedStoryDescriptionTextArea = ({
  onEdit,
  disabled,
  description,
  users
}) => {
  const formatMention = (_, display) => `@${display}`;
  const data = users.map(({ id, username }) => ({ id, display: username }));

  return (
    <MentionsInput
      className="form-control input-sm edit-description-text textarea"
      onChange={(event) => onEdit(event.target.value)}
      readOnly={disabled}
      value={description}
      data-id="text-area"
    >
      <Mention
        markup="@__display__"
        displayTransform={formatMention}
        data={data}
      />
    </MentionsInput>
  )
};

ExpandedStoryDescriptionTextArea.defaultProps = {
  description: '',
  users: [],
  disabled: false
};

ExpandedStoryDescriptionTextArea.propTypes = {
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  description: PropTypes.string.isRequired
};
  
export default ExpandedStoryDescriptionTextArea;
