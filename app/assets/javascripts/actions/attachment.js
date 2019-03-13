import { updateStorySuccess } from './story';
import actionTypes from './actionTypes';
import { storyFailure } from './story';

export const addAttachmentToStory = (storyId, attachment) => ({
  type: actionTypes.ADD_ATTACHMENT,
  storyId,
  attachment
});

export const removeAttachment = (storyId, attachmentId) => ({
  type: actionTypes.DELETE_ATTACHMENT,
  storyId,
  attachmentId
});

export const addAttachment = (storyId, projectId, attachment) =>
  async (dispatch, getState, { Story }) => {
    dispatch(addAttachmentToStory(storyId, attachment));

    const { stories } = getState();
    const story = stories.find(story => story.id === storyId);
    const options = { collapse: false };

    try {
      const updatedStory = await Story.update(story._editing, projectId, options);
      return dispatch(updateStorySuccess(updatedStory));
    }
    catch (error) {
      return dispatch(storyFailure(storyId, error));
    }
  }

