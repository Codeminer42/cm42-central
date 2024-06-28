import actionTypes from './actionTypes';

export const addLabelToProject = label => ({
  type: actionTypes.ADD_LABEL_TO_PROJECT,
  label,
});

export const addLabelSuccess = (storyId, label) => ({
  type: actionTypes.ADD_LABEL,
  storyId,
  label,
});

export const removeLabel = (storyId, labelName) => ({
  type: actionTypes.DELETE_LABEL,
  storyId,
  labelName,
});

export const addLabel = (storyId, label) => dispatch => {
  dispatch(addLabelSuccess(storyId, label));
  dispatch(addLabelToProject(label));
};
