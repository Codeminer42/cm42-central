import React from 'react';
import ReactTags from 'react-tag-autocomplete';


class ExpandedStoryLabels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: this.splitTags(props.labels)
    }

    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  splitTags(tags) {
    return (
      tags.split(',')
        .map((tag, index) => (
          {
            id: index,
            name: tag
          }
        ))
    );
  };

  joinTags(tags) {
    return (
      tags.map(tag => tag.name).join(',')
    );
  }

  handleDelete(index) {
    const { onEdit } = this.props;
    const tags = this.state.tags.filter((tag, tagIndex) => tagIndex !== index);

    this.setState(
      { tags }, () => {
        onEdit(this.joinTags(this.state.tags))
      }
    );
  }

  handleAddition(tag) {
    const { onEdit } = this.props;

    this.setState(
      { tags: [...this.state.tags, tag] }, () => {
        onEdit(this.joinTags(this.state.tags))
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
            autoresize={false} />
        }
      </div>
    );
  }
};

export default ExpandedStoryLabels;
