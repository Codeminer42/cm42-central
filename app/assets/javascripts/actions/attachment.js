import { updateStorySuccess } from './story';
import actionTypes from './actionTypes';
import { storyFailure } from './story';

const defaultFrom = 'all';

export const addAttachmentToStory = (storyId, attachment, from = defaultFrom) => ({
  type: actionTypes.ADD_ATTACHMENT,
  storyId,
  attachment,
  from
});

export const removeAttachment = (storyId, attachmentId, from = defaultFrom) => ({
  type: actionTypes.DELETE_ATTACHMENT,
  storyId,
  attachmentId,
  from
});

export const addAttachment = (storyId, projectId, attachment, from = defaultFrom) =>
  async (dispatch, getState, { Story }) => {
    dispatch(addAttachmentToStory(storyId, attachment));

    const { stories } = getState();
    const story = stories[from].find(story => story.id === storyId);
    const options = { collapse: false };

    try {
      const updatedStory = await Story.update(story._editing, projectId, options);
      return dispatch(updateStorySuccess(updatedStory));
    }
    catch (error) {
      return dispatch(storyFailure(storyId, error));
    }
  }

