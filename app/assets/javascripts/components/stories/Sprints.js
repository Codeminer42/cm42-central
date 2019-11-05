import React from "react";
import PropTypes from "prop-types";
import Sprint from "./Sprint";

const propTypes = {
  sprints: PropTypes.array
};

const defaultProps = {
  sprints: [],
};

const renderSprints = (sprints, fetchStories, columnId) =>
  sprints.map(
    (sprint, index) =>
      sprint ? (
        <Sprint
          key={sprint.number}
          sprint={sprint}
          sprintIndex={index}
          columnId={columnId}
          fetchStories={fetchStories}
        />
      ) : null
  )

const Sprints = ({ sprints, fetchStories, columnId}) => {
  if (!sprints.length) return null;

  return <div className="Sprints">{renderSprints(sprints, fetchStories, columnId)}</div>;
};

Sprint.propTypes = propTypes;
Sprint.defaultProps = defaultProps;

export default Sprints;
