import React from "react";
import PropTypes from "prop-types";
import Sprint from "./Sprint";
import { sortSprints } from '../../models/beta/sprint';

const propTypes = {
  sprints: PropTypes.array
};

const defaultProps = {
  sprints: [],
};

const renderSprints = (sprints, fetchStories) => {
  return sortSprints(sprints).map(
    (sprint, index) =>
      sprint ? (
        <Sprint
          key={sprint.number}
          sprint={sprint}
          fetchStories={fetchStories}
        />
      ) : null
  );
};

const Sprints = ({ sprints, fetchStories }) => {
  if (!sprints.length) return null;

  return <div className="Sprints">{renderSprints(sprints, fetchStories)}</div>;
};

Sprint.propTypes = propTypes;
Sprint.defaultProps = defaultProps;

export default Sprints;
