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
    const { story, onRemoveLabel } = this.props;
    const { labels } = story._editing;

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
    const { projectLabels, story } = this.props;
    const { labels } = story._editing;

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
            autoresize={false}
            autofocus={false}
          />
        }
      </div>
    );
  }
};

ExpandedStoryLabels.propTypes = {
  story: PropTypes.shape({
    _editing: PropTypes.shape({
      labels: PropTypes.array.isRequired
    })
  }),
  onAddLabel: PropTypes.func.isRequired,
  onRemoveLabel: PropTypes.func.isRequired,
  projectLabels: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ExpandedStoryLabels;
