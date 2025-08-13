import React, { useMemo, useState, useCallback } from 'react';
import { Mention } from 'primereact/mention';
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

  const [suggestions, setSuggestions] = useState([]);
  const source = useMemo(
    () =>
      Array.isArray(usernames) ? usernames.map(u => ({ name: String(u) })) : [],
    [usernames]
  );
  const onSearch = useCallback(
    e => {
      if (e.trigger !== '@') {
        setSuggestions([]);
        return;
      }
      const q = (e.query || '').toLowerCase();
      setSuggestions(
        source.filter(item => item.name.toLowerCase().includes(q)).slice(0, 10)
      );
    },
    [source]
  );

  return (
    <>
      <label htmlFor={name}>
        {I18n.t('activerecord.attributes.story.description')}
      </label>
      <br />
      {showDescriptionInput ? (
        <Mention
          inputId={name}
          value={value}
          onChange={onChange}
          trigger={['@']}
          suggestions={suggestions}
          onSearch={onSearch}
          field="name"
          inputClassName="form-control"
          autoResize={false}
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
