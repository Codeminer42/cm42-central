import { addAttachment, addAttachmentToStory } from '../../../app/assets/javascripts/actions/attachment';
import { updateStorySuccess, storyFailure } from '../../../app/assets/javascripts/actions/story';
import storyFactory from '../support/factories/storyFactory';

describe('Attachment Actions', () => {
  describe('addAttachment', () => {
    let story;
    const projectId = 42;

    beforeEach(() => {
      story = { ...storyFactory(), _editing: storyFactory() };
    });

    it('dispatch addAttachmentToStory with the new attachment', async () => {
      const newAttachment = { id: 1 }

      const FakeStory = {
        update: sinon.stub().resolves(story)
      };

      const fakeDispatch = sinon.stub();

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: [story] });

      await addAttachment(story.id, projectId, newAttachment)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(addAttachmentToStory(story.id, newAttachment));
    });

    it('calls Story update and dispatch updateStorySuccess', async () => {
      const newAttachment = { id: 1 }

      const FakeStory = {
        update: sinon.stub().resolves(story)
      };

      const fakeDispatch = sinon.stub();

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: [story] });

      await addAttachment(story.id, projectId, newAttachment)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(FakeStory.update).toHaveBeenCalledWith(story._editing, projectId);
      expect(fakeDispatch).toHaveBeenCalledWith(updateStorySuccess(story));
    });

    it('dispatch storyFailure on failure', async () => {
      const newAttachment = { id: 1 }
      const error = { error: 'error' }

      const FakeStory = {
        update: sinon.stub().rejects(error)
      };

      const fakeDispatch = sinon.stub();

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: [story] });

      await addAttachment(story.id, projectId, newAttachment)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(storyFailure(story.id, error));
    });
  });
});
