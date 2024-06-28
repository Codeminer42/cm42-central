import React, { Fragment } from 'react';
import AtWhoInput from 'components/jquery_wrappers/AtWhoInput';
import DescriptionContent from 'components/description/DescriptionContent';

class StoryDescription extends React.Component {
  editDescription() {
    const { usernames, name, value, onChange } = this.props;
    return (
      <AtWhoInput
        usernames={usernames}
        name={name}
        value={value}
        onChange={onChange}
      />
    );
  }

  descriptionContent() {
    const { linkedStories, isReadonly, description, onClick, value } =
      this.props;
    return (
      <DescriptionContent
        linkedStories={linkedStories}
        isReadonly={isReadonly}
        description={description}
        onClick={onClick}
        value={value}
      />
    );
  }

  render() {
    const { name, isNew, editingDescription } = this.props;
    return (
      <Fragment>
        <label htmlFor={name}>
          {I18n.t('activerecord.attributes.story.description')}
        </label>
        <br />
        {isNew || editingDescription
          ? this.editDescription()
          : this.descriptionContent()}
      </Fragment>
    );
  }
}

export default StoryDescription;
