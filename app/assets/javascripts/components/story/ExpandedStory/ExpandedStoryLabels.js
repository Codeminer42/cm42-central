import React from 'react';
import ReactTags from 'react-tag-autocomplete';
import PropTypes from 'prop-types';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

class ExpandedStoryLabels extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(index) {
    const { story, onRemoveLabel, disabled } = this.props;
    const { labels } = story._editing;

    if(disabled) return;

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
    const { projectLabels, story, disabled } = this.props;
    const { labels } = story._editing;

    if(disabled && !story.labels.length) return null

    return (
      <ExpandedStorySection
        title={I18n.t('activerecord.attributes.story.labels')}
      >
        <ReactTags
          tags={labels}
          handleDelete={this.handleDelete}
          suggestions={projectLabels}
          handleAddition={this.handleAddition}
          allowNew={!disabled}
          inputAttributes={{readOnly: disabled}}
          placeholder={disabled ? "" : I18n.t('add new label')}
          allowBackspace={false}
          addOnBlur={true}
          delimiterChars={[',', ' ']}
          autoresize={false}
          autofocus={false}
        />
      </ExpandedStorySection>
    )
  }
};

ExpandedStoryLabels.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onAddLabel: PropTypes.func.isRequired,
  onRemoveLabel: PropTypes.func.isRequired,
  projectLabels: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryLabels;
