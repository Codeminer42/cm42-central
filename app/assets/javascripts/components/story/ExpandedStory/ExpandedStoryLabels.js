import React from 'react';
import ReactTags from 'react-tag-autocomplete';
import PropTypes from 'prop-types';

class ExpandedStoryLabels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: props.labels
    }

    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(index) {
    const { onEdit } = this.props;
    const tags = this.state.tags.filter((tag, tagIndex) => tagIndex !== index);

    this.setState(
      { tags }, () => {
        onEdit(this.state.tags)
      }
    );
  }

  handleAddition(tag) {
    const { onEdit } = this.props;

    this.setState(
      { tags: [...this.state.tags, tag] }, () => {
        onEdit(this.state.tags)
      }
    );
  }

  render() {
    return (
      <div className="Story__section">
        <div className="Story__section-title">
          {I18n.t('activerecord.attributes.story.labels')}
        </div>
        {
          <ReactTags
            tags={this.state.tags}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            allowNew={true}
            placeholder={I18n.t('add new label')}
            allowBackspace={false}
            addOnBlur={true}
            delimiterChars={[' ']}
            autoresize={false} />
        }
      </div>
    );
  }
};

ExpandedStoryLabels.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired
};

export default ExpandedStoryLabels;
