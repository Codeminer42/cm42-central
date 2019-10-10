import { updateStorySuccess, storyFailure } from './story';
import actionTypes from './actionTypes';

export const addAttachmentToStory = (storyId, attachment, from) => ({
  type: actionTypes.ADD_ATTACHMENT,
  storyId,
  attachment,
  from
});

export const removeAttachment = (storyId, attachmentId, from) => ({
  type: actionTypes.DELETE_ATTACHMENT,
  storyId,
  attachmentId,
  from
});

export const addAttachment = (storyId, projectId, attachment, from) =>
  async (dispatch, getState, { Story }) => {
    dispatch(addAttachmentToStory(storyId, attachment, from));

    const { stories } = getState();
    const story = Story.withScope(stories, from).find(story => story.id === storyId);
    const options = { collapse: false };

    try {
      const updatedStory = await Story.update(story._editing, projectId, options);
      return dispatch(updateStorySuccess(updatedStory, from));
    }
    catch (error) {
      return dispatch(storyFailure(storyId, error));
    }
  }

