import PropTypes from "prop-types";
import NotePropTypes from "./note";
import TaskPropType from "./task";

export const storyPropTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.symbol]),
  title: PropTypes.string,
  description: PropTypes.string,
  estimate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  storyType: PropTypes.string,
  state: PropTypes.string,
  acceptedAt: PropTypes.string,
  requestedById: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ownedById: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  projectId: PropTypes.number,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  position: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  labels: PropTypes.array,
  requestedByName: PropTypes.string,
  ownedByName: PropTypes.string,
  ownedByInitials: PropTypes.string,
  releaseDate: PropTypes.string,
  deliveredAt: PropTypes.string,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  notes: PropTypes.arrayOf(NotePropTypes.isRequired),
  tasks: PropTypes.arrayOf(TaskPropType.isRequired),
};

const storyPropTypesShape = PropTypes.shape(storyPropTypes).isRequired;

export default storyPropTypesShape;
