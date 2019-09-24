import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../Markdown';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';
import { MentionsInput, Mention } from 'react-mentions';

class ExpandedStoryDescription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };

    this.toggleField = this.toggleField.bind(this);
    this.mentionFormat = this.mentionFormat.bind(this);
  };

  toggleField() {
    this.setState({ editing: !this.state.editing });
  };

  mentionFormat(id, display) {
    return `@${display}`;
  }

  editButton() {
    return (
      <button className='edit-description-button'>
        { I18n.t('edit') }
      </button>
    );
  };

  descriptionContent(description) {
    return (
      <div className='markdown-wrapper'>
        <Markdown source={description} />
      </div>
    );
  };

  descriptionTextArea(description, suggestedUsers) {
    const { disabled, onEdit } = this.props;

    return (
      <MentionsInput
        className="form-control input-sm edit-description-text textarea"
        onChange={(event) => onEdit(event.target.value)}
        readOnly={disabled}
        value={description}
      >
        <Mention
          markup="@__display__"
          displayTransform={this.mentionFormat}
          data={suggestedUsers}
        />
      </MentionsInput>
    );
  };

  render() {
    const { story, disabled, users } = this.props;

    const suggestedUsers = users.map(({ id, username }) => ({ id, display: username }));

    if(disabled && !story.description) return null

    return (
      <ExpandedStorySection
        title={I18n.t('activerecord.attributes.story.description')}
        identifier="description"
      >
        {
          this.state.editing
            ? this.descriptionTextArea(story._editing.description || '', suggestedUsers)
            : (
              <div onClick={this.toggleField} className='story-description-content'>
                {
                  story.description
                    ? this.descriptionContent(story.description)
                    : this.editButton()
                }
              </div>
            )
        }
      </ExpandedStorySection>
    );
  };
};

ExpandedStoryDescription.defaultProps = {
  users: [],
};

ExpandedStoryDescription.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryDescription;
