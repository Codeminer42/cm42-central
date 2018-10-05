import React from "react";
import PropTypes from "prop-types";
import Sprint from "./Sprint";

const propTypes = {
  stories: PropTypes.array,
  project: PropTypes.object,
  sprints: PropTypes.array,
};

const defaultProps = {
  stories: [],
  project: {},
  sprints: [],
};

const renderSprints = sprints => {
  return sprints.map(
    (sprint, index) =>
      sprint ? (
        <Sprint
          key={sprint.number}
          number={sprint.number}
          startDate={sprint.startDate}
          stories={sprint.stories}
          points={sprint.points}
          completedPoints={sprint.completedPoints}
        />
      ) : null
  );
};

const Sprints = ({ sprints }) => {
  if (!sprints.length) return null;

  return <div className="Sprints">{renderSprints(sprints)}</div>;
};

Sprint.propTypes = propTypes;
Sprint.defaultProps = defaultProps;

export default Sprints;
