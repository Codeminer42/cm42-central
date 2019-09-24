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
      editing: false,
      users: [],
    };

    this.toggleField = this.toggleField.bind(this);
  };

  toggleField() {
    this.setState({ editing: !this.state.editing });
  };

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
        className="form-control input-sm edit-description-text"
        onChange={(event) => onEdit(event.target.value)}
        readOnly={disabled}
        value={description}
      >
        <Mention
          markup="@__display__"
          displayTransform={(id, display) => `@${display}`}
          data={suggestedUsers}
        />
      </MentionsInput>
    );
  };

  render() {
    const { story, disabled } = this.props;

    const suggestedUsers = (this.props.users && this.props.users.map(user => ({ id: user.id, display: user.username })));

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

ExpandedStoryDescription.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryDescription;
