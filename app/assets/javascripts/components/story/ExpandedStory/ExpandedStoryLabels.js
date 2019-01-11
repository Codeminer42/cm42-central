import React from 'react';
import ReactTags from 'react-tag-autocomplete';
import PropTypes from 'prop-types';

class ExpandedStoryLabels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: props.labels
    }

    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(index) {
    const { onEdit } = this.props;
    const labels = this.state.labels.filter((label, labelIndex) => labelIndex !== index);

    this.setState(
      { labels }, () => {
        onEdit(this.state.labels)
      }
    );
  }

  handleAddition(label) {
    const { onEdit, addLabel } = this.props;

    this.setState(
      { labels: [...this.state.labels, label] }, () => {
        onEdit(this.state.labels);
        addLabel(label);
      }
    );
  }

  render() {
    const { projectLabels } = this.props;

    return (
      <div className="Story__section">
        <div className="Story__section-title">
          {I18n.t('activerecord.attributes.story.labels')}
        </div>
        {
          <ReactTags
            tags={this.state.labels}
            handleDelete={this.handleDelete}
            suggestions={projectLabels}
            handleAddition={this.handleAddition}
            allowNew={true}
            placeholder={I18n.t('add new label')}
            allowBackspace={false}
            addOnBlur={true}
            delimiterChars={[',',' ']}
            autoresize={false} />
        }
      </div>
    );
  }
};

ExpandedStoryLabels.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  addLabel: PropTypes.func.isRequired,
  projectLabels:PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ExpandedStoryLabels;
