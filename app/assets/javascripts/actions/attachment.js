import { editStory, updateStory } from './story';

const deleteAttachment = (documents, id) =>
  documents.filter(document => document.id !== id);

export const addAttachment = (storyId, projectId, attachment) =>
  (dispatch, getState) => {
    const { stories } = getState();
    const story = stories.find(story => story.id === storyId);
    const documents = [...story.documents, attachment];

    dispatch(editStory(storyId, { documents }));
    dispatch(updateStory(storyId, projectId, false));
  }

export const removeAttachment = (storyId, documentId) =>
  (dispatch, getState) => {
    const { stories } = getState();
    const story = stories.find(story => story.id === storyId);
    const documents = deleteAttachment(story._editing.documents, documentId);

    dispatch(editStory(storyId, { documents }));
  }
