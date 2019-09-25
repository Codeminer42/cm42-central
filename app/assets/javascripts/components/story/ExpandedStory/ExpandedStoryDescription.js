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
    this.formatMention = this.formatMention.bind(this);
  };

  toggleField() {
    this.setState({ editing: !this.state.editing });
  };

  formatMention = (id, display) =>`@${display}`;

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

  descriptionTextArea(description) {
    const { disabled, onEdit, users } = this.props;

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
          displayTransform={this.formatMention}
          data={suggestedUsers}
        />
      </MentionsInput>
    );
  };

  render() {
    const { story, disabled } = this.props;

    if(disabled && !story.description) return null

    return (
      <ExpandedStorySection
        title={I18n.t('activerecord.attributes.story.description')}
        identifier="description"
      >
        {
          this.state.editing
            ? this.descriptionTextArea(story._editing.description || '')
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
