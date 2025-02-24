import React, { useEffect, useRef } from 'react';

const AtWhoInput = ({ usernames, name, value, onChange }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    loadAtWho();
  }, [value]);

  const loadAtWho = () => {
    if (textareaRef.current) {
      $(textareaRef.current)
        .atwho({
          at: '@',
          data: usernames,
        })
        .on('inserted.atwho', onChange);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      name={name}
      className={`form-control ${name}-textarea`}
      defaultValue={value}
      onChange={onChange}
    />
  );
};

export default AtWhoInput;
