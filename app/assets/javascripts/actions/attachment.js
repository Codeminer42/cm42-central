import { updateStorySuccess } from './story';
import actionTypes from './actionTypes';

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
  (dispatch, getState, { Story }) => {
    dispatch(addAttachmentToStory(storyId, attachment));

    const { stories } = getState();
    const story = stories.find(story => story.id === storyId);

    Story.update(story._editing, projectId, false).then((story) => {
      dispatch(updateStorySuccess(story));
    })
  }

