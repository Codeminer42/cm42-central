import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../Markdown';

class ExpandedStoryDescription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };

    this.changeField = this.changeField.bind(this);
  };

  changeField() {
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

  renderContent() {
    const { story } = this.props;

    if (this.state.editing) {
      return this.descriptionTextArea(story._editing.description || '')
    };

    return (
      <div onClick={this.changeField} className='story-description-content'>
        {
          story.description ?
            this.descriptionContent(story.description)
            :
            this.editButton()
        }
      </div>
    );
  };

  render() {
    return (
      <div className="Story__section">
        <div className="Story__section-title">
          { I18n.t('activerecord.attributes.story.description') }
        </div>

        { this.renderContent() }

      </div>
    );
  };
};

ExpandedStoryDescription.propTypes = {
  story: PropTypes.object,
  onEdit: PropTypes.func
};

export default ExpandedStoryDescription;
