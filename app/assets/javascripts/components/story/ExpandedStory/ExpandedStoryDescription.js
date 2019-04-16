import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../Markdown';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

class ExpandedStoryDescription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
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

  descriptionTextArea(description) {
    const { onEdit, disabled } = this.props;

    return (
      <textarea
        className="form-control input-sm edit-description-text"
        onChange={(event) => onEdit(event.target.value)}
        readOnly={disabled}
        value={description}
      />
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

ExpandedStoryDescription.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryDescription;
