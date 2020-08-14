import React from "react";
import { editingStoryPropTypesShape } from "../../../models/beta/story";
import ExpandedStorySection from "./ExpandedStorySection";

const ExpandedStoryAcceptedBy = ({ story }) => {
  return story._editing.acceptedByName ? (
    <ExpandedStorySection
      title={I18n.t("activerecord.attributes.story.accepted_by")}
    >
      {story._editing.acceptedByName}
    </ExpandedStorySection>
  ) : null;
};

ExpandedStoryAcceptedBy.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
};

export default ExpandedStoryAcceptedBy;
