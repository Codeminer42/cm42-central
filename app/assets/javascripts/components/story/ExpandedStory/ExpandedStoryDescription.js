import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../Markdown';

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
    const { onEdit } = this.props;

    return (
      <textarea
        className="form-control input-sm edit-description-text"
        onChange={(event) => onEdit({ description: event.target.value })}
        value={description}
      />
    );
  };

  render() {
    const { story } = this.props;

    return (
      <div className="Story__section">
        <div className="Story__section-title">
          { I18n.t('activerecord.attributes.story.description') }
        </div>

        {
          this.state.editing
            ? (
              this.descriptionTextArea(story._editing.description || '')
            ) : (
              <div onClick={this.toggleField} className='story-description-content'>
                {
                  story.description
                    ? this.descriptionContent(story.description)
                    : this.editButton()
                }
              </div>
            )
        }
      </div>
    );
  };
};

ExpandedStoryDescription.propTypes = {
  story: PropTypes.object,
  onEdit: PropTypes.func
};

export default ExpandedStoryDescription;
