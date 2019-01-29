import React from 'react';
import ReactTags from 'react-tag-autocomplete';
import PropTypes from 'prop-types';

class ExpandedStoryLabels extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(index) {
    const { labels, onRemoveLabel } = this.props;

    const label = labels.find(
      (label, labelIndex) => labelIndex === index
    );

    onRemoveLabel(label.name);
  }

  handleAddition(label) {
    const { onAddLabel } = this.props;

    onAddLabel(label);
  }

  render() {
    const { projectLabels, labels } = this.props;

    return (
      <div className="Story__section">
        <div className="Story__section-title">
          {I18n.t('activerecord.attributes.story.labels')}
        </div>
        {
          <ReactTags
            tags={labels}
            handleDelete={this.handleDelete}
            suggestions={projectLabels}
            handleAddition={this.handleAddition}
            allowNew={true}
            placeholder={I18n.t('add new label')}
            allowBackspace={false}
            addOnBlur={true}
            delimiterChars={[',', ' ']}
            autoresize={false} />
        }
      </div>
    );
  }
};

ExpandedStoryLabels.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAddLabel: PropTypes.func.isRequired,
  onRemoveLabel: PropTypes.func.isRequired,
  projectLabels: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ExpandedStoryLabels;
