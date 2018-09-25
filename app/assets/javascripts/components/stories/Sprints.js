import React from "react";
import PropTypes from "prop-types";
import Sprint from "./Sprint";
import * as Iteration from "models/beta/iteration";

const propTypes = {
  stories: PropTypes.array,
  project: PropTypes.object
};

const defaultProps = {
  stories: [],
  project: {}
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

const Sprints = ({ stories, project }) => {
  const currentSprintNumber = Iteration.getCurrentIteration(project) || 0;
  const sprints = Iteration.groupBySprints(
    stories,
    project,
    currentSprintNumber
  );

  if (!stories.length) return null;

  return <div className="Sprints">{renderSprints(sprints)}</div>;
};

Sprint.propTypes = propTypes;
Sprint.defaultProps = defaultProps;

export default Sprints;
