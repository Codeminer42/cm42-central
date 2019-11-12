import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../Markdown';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';
import { MentionsInput, Mention } from 'react-mentions';

const ExpandedStoryDescription = ({
  disabled,
  onEdit,
  users
}) => {
  const [editing, setEditing] = useState(false);

  const toggleField = () => setEditing(!editing);

  const formatMention = (id, display) => `@${display}`;

  const editButton = () =>
    <button className='edit-description-button'>
      { I18n.t('edit') }
    </button>

  const descriptionContent = description =>
    <div className='markdown-wrapper'>
      <Markdown source={description} />
    </div>

  const descriptionTextArea = description => {
    const suggestedUsers = users.map(({ id, username }) => ({ id, display: username }));

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
          data={suggestedUsers}
        />
      </MentionsInput>
    );
  }

  return disabled && !story.description ? null :
    <ExpandedStorySection
      title={I18n.t('activerecord.attributes.story.description')}
      identifier="description"
    >
      {
        editing
          ? descriptionTextArea(story._editing.description || '')
          : (
            <div onClick={toggleField} className='story-description-content'>
              {
                story.description
                  ? descriptionContent(story.description)
                  : editButton()
              }
            </div>
          )
      }
    </ExpandedStorySection>
}

ExpandedStoryDescription.defaultProps = {
  users: [],
};

ExpandedStoryDescription.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryDescription;
