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
  const showDescriptionInput = isNew || editingDescription;

  return (
    <>
      <label htmlFor={name}>
        {I18n.t('activerecord.attributes.story.description')}
      </label>
      <br />
      {showDescriptionInput ? (
        <AtWhoInput
          usernames={usernames}
          name={name}
          value={value}
          onChange={onChange}
        />
      ) : (
        <DescriptionContent
          linkedStories={linkedStories}
          isReadonly={isReadonly}
          description={description}
          onClick={onClick}
          value={value}
        />
      )}
    </>
  );
};

export default StoryDescription;
