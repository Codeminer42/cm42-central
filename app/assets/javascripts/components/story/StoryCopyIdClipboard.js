import React from "react";
import Clipboard from "react-clipboard.js";

const StoryCopyIdClipboard = ({ id }) => {
  return (
    <Clipboard
      data-clipboard-text={`#${id}`}
      component="button"
      className="story-id"
      title={I18n.t("story.events.copy_id")}
    >
      #{id}
    </Clipboard>
  );
};

export default StoryCopyIdClipboard;
