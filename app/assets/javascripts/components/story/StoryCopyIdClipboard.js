import React from "react";

const StoryCopyIdClipboard = ({ id }) => {
  return (
    <button
      type="button"
      className="story-id"
      data-clipboard-text={`#${id}`}
      title={I18n.t('story.events.copy_id')}
    >
      #{id}
    </button>
  );
};

export default StoryCopyIdClipboard;
