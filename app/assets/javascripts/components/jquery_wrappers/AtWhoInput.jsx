import React, { useMemo, useState, useEffect } from 'react';
import { MentionsInput, Mention } from 'react-mentions';

const AtWhoInput = ({ usernames, name, value, onChange }) => {
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  const mentionableUsers = useMemo(
    () =>
      (usernames || []).map(u =>
        typeof u === 'string'
          ? { id: u, display: u }
          : {
              id: u.id ?? u.username ?? u.name ?? '',
              display: u.username ?? u.name ?? u.id ?? '',
            }
      ),
    [usernames]
  );

  const handleChange = (event, newValue) => {
    setInternalValue(newValue);
    onChange?.({ target: { name, value: newValue } });
  };

  return (
    <MentionsInput
      value={internalValue}
      onChange={handleChange}
      name={name}
      className={`form-control ${name}-textarea`}
    >
      <Mention
        trigger="@"
        data={mentionableUsers}
        markup="@__id__"
        displayTransform={(_, display) => `@${display}`}
        appendSpaceOnAdd
      />
    </MentionsInput>
  );
};

export default AtWhoInput;
