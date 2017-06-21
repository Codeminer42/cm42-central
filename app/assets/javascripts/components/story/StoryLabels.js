import React from 'react';
import TaggedInput from 'components/jquery_wrappers/TaggedInput';

const StoryLabels = ({ name, className, value, availableLabels, onChange, disabled = false }) =>
  <div>
    <label htmlFor={name}>{ I18n.t(`activerecord.attributes.story.${name}`) }</label>
    <br />
    <TaggedInput
      onChange={onChange}
      availableLabels={availableLabels}
      disabled={disabled}
      input={{
        name,
        defaultValue: value,
        className: `form-control input-sm ${className}`,
        disabled,
      }}
    />
  </div>

export default StoryLabels;
