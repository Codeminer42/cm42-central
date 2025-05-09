import React, { useEffect, useRef } from 'react';

const TaggedInput = ({ availableLabels, disabled, onChange, input }) => {
  const inputRef = useRef(null);

  const tagitProperties = {
    availableTags: availableLabels,
    readOnly: disabled,
  };

  useEffect(() => {
    if (inputRef.current) {
      $(inputRef.current).tagit(tagitProperties).on('change', onChange);
    }

    return () => {
      if (inputRef.current) {
        $(inputRef.current).tagit('destroy');
      }
    };
  }, [availableLabels, disabled, onChange]);

  return <input ref={inputRef} {...input} />;
};

export default TaggedInput;
