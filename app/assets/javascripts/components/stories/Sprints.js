import React from "react";
import PropTypes from "prop-types";
import Sprint from "./Sprint";

const propTypes = {
  sprints: PropTypes.array
};

const defaultProps = {
  sprints: [],
};

const renderSprints = (column, sprints, fetchStories) => {
  return sprints.map(
    (sprint, index) =>
      sprint ? (
        <Sprint
          column={column}
          key={sprint.number}
          sprint={sprint}
          fetchStories={fetchStories}
        />
      ) : null
  );
};

const Sprints = ({ column, sprints, fetchStories }) => {
  if (!sprints.length) return null;

  return <div className="Sprints">{renderSprints(column, sprints, fetchStories)}</div>;
};

Sprint.propTypes = propTypes;
Sprint.defaultProps = defaultProps;

export default Sprints;
