import React from 'react';
import AtWhoInput from 'components/jquery_wrappers/AtWhoInput';
import DescriptionContent from 'components/description/DescriptionContent';

const StoryDescription = ({
  usernames,
  name,
  value,
  onChange,
  linkedStories,
  isReadonly,
  description,
  onClick,
  isNew,
  editingDescription,
}) => {
  const editDescription = () => (
    <AtWhoInput
      usernames={usernames}
      name={name}
      value={value}
      onChange={onChange}
    />
  );

  const descriptionContent = () => (
    <DescriptionContent
      linkedStories={linkedStories}
      isReadonly={isReadonly}
      description={description}
      onClick={onClick}
      value={value}
    />
  );

  return (
    <>
      <label htmlFor={name}>
        {I18n.t('activerecord.attributes.story.description')}
      </label>
      <br />
      {isNew || editingDescription ? editDescription() : descriptionContent()}
    </>
  );
};

export default StoryDescription;
