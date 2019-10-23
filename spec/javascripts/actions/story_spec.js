import * as Story from 'actions/story';
import storyFactory from '../support/factories/storyFactory';

describe('Story Actions', () => {
  describe('saveStory', () => {
    const story = storyFactory();
    const projectId = 42;

    it('calls Story.update with story._editing and projectId', async () => {
      const editedStory = {
        ...story,
        _editing: {
          ...story,
          _isDirty: true
        }
      };

      const FakeStory = {
        findById: sinon.stub().returns(editedStory),
        update: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(false),
        withScope: sinon.stub().returns([story])
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(FakeStory.update).toHaveBeenCalledWith(editedStory._editing, projectId);
    });

    it('dispatch only toggleStory when _isDirty is false', async () => {
      const editedStory = {
        ...story,
        _editing: {
          ...story,
          _isDirty: false
        }
      };

      const FakeStory = {
        findById: sinon.stub().returns(editedStory),
        update: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(false),
        withScope: sinon.stub().returns([story])
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.toggleStory(editedStory.id));
      expect(fakeDispatch).not.toHaveBeenCalledWith(Story.updateStorySuccess(story));
    });

    it('dispatch updateStorySuccess when _isDirty', async () => {
      const editedStory = {
        ...story,
        _editing: {
          ...story,
          _isDirty: true
        }
      };

      const FakeStory = {
        findById: sinon.stub().returns(editedStory),
        update: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(false),
        withScope: sinon.stub().returns([story])
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.updateStorySuccess(story));
    });

    it('dispatch only addStory when isNew', async () => {
      const editedStory = {
        ...story,
        _editing: {
          ...story
        }
      };

      const FakeStory = {
        findById: sinon.stub().returns(editedStory),
        post: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(true),
        withScope: sinon.stub().returns([story])
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.addStory(story));
      expect(fakeDispatch).not.toHaveBeenCalledWith(Story.updateStorySuccess(story));
      expect(fakeDispatch).not.toHaveBeenCalledWith(Story.toggleStory(editedStory.id));
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: "boom" };

      const editedStory = {
        ...story,
        _editing: {
          ...story,
          loading: true,
          _isDirty: true
        }
      };

      const FakeStory = {
        findById: sinon.stub().returns(editedStory),
        update: sinon.stub().rejects(error),
        isNew: sinon.stub().returns(false),
        withScope: sinon.stub().returns([story])
      };

      const fakeDispatch = sinon.stub().resolves({});
      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: { all:  [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.storyFailure(editedStory.id, error));
    });
  });

  describe('deleteStory', () => {
    const storyId = 420;
    const projectId = 42;
    const story = { id: storyId, title: 'foo' }

    it('calls Story.deleteStory with projectId and storyId', async () => {
      const FakeStory = {
        findById: sinon.stub().returns(story),
        deleteStory: sinon.stub().resolves({}),
        withScope: sinon.stub().returns([story])
      };
      const fakeGetState = sinon.stub().returns({
        stories: {
          all: [story]
        }
      });
      const fakeDispatch = sinon.stub().resolves({});

      await Story.deleteStory(storyId, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(FakeStory.deleteStory).toHaveBeenCalledWith(storyId, projectId);
    });

    it('dispatch deleteStorySuccess', async () => {
      const FakeStory = {
        findById: sinon.stub().returns(story),
        deleteStory: sinon.stub().resolves({}),
        withScope: sinon.stub().returns([story])
      };
      const fakeGetState = sinon.stub().returns({
        stories: { all: [story] }
      });
      const fakeDispatch = sinon.stub().resolves({});

      await Story.deleteStory(storyId, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.deleteStorySuccess(storyId));
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: "boom" };

      const FakeStory = {
        findById: sinon.stub().returns(story),
        deleteStory: sinon.stub().rejects(error),
        withScope: sinon.stub().returns([story])
      };
      const fakeGetState = sinon.stub().returns({
        stories: { all: [story] }
      });
      const fakeDispatch = sinon.stub().resolves({});

      await Story.deleteStory(storyId, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.storyFailure(storyId, error));
    });
  });

  describe('highlight', () => {
    it('always dispatch updateHighlight', () => {
      const storyId = 1;
      const fakeDispatch = sinon.stub().resolves({});
      const fakeGetState = sinon.stub().returns({});

      Story.highlight(storyId)
        (fakeDispatch, fakeGetState, {});

      expect(fakeDispatch).toHaveBeenCalledWith(Story.updateHighlight(storyId, true));
    });
  });

  describe('confirmBeforeSaveIfNeeded', () => {
    let story;

    beforeEach(() => {
      story = storyFactory();
    });

    describe('when do not need of confirmation', () => {
      const needConfirmation = sinon.stub().returns(false);
      const confirm = sinon.stub();

      describe('and callback.onConfirmed do not throws an error', () => {
        it('call callback.onConfirmed', async () => {
          const callback = { onConfirmed: sinon.stub() };

          await Story.confirmBeforeSaveIfNeeded(story, confirm, needConfirmation, callback);
          expect(callback.onConfirmed).toHaveBeenCalled();
        });
      });

      describe('and callback.onConfirmed throws an error', () => {
        let error;
        let callback;

        beforeEach(() => {
          error = { error: "boom" };
          callback = { 
            onConfirmed: sinon.stub().rejects(error), 
            onError: sinon.stub() 
          };
        });

        it('call callback.onConfirmed', async () => {
          await Story.confirmBeforeSaveIfNeeded(story, confirm, needConfirmation, callback);

          expect(callback.onConfirmed).toHaveBeenCalled();
        });

        it('call callback.onError', async () => {
          await Story.confirmBeforeSaveIfNeeded(story, confirm, needConfirmation, callback);

          expect(callback.onError).toHaveBeenCalled();
        });
      });
    });

    describe('when need of confirmation', () => {
      describe('and is not confirmed', () => {
        let callback;
        let needConfirmation;
        let confirm;

        beforeEach(() => {
          callback = { onConfirmed: sinon.stub() };
          needConfirmation = sinon.stub().returns(true);
          confirm = sinon.stub().returns(false);
        });

        it('do not call callback.onConfirmed', async () => {
          await Story.confirmBeforeSaveIfNeeded(story, confirm, needConfirmation, callback);

          expect(callback.onConfirmed).not.toHaveBeenCalled();
        });
      });

      describe('and is confirmed', () => {
        const needConfirmation = sinon.stub().returns(true);
        const confirm = sinon.stub().returns(true);

        describe('and callback.onConfirmed do not throws an error', () => {
          it('call callback.onConfirmed', async () => {
            const callback = { onConfirmed: sinon.stub() };

            await Story.confirmBeforeSaveIfNeeded(story, confirm, needConfirmation, callback);
            expect(callback.onConfirmed).toHaveBeenCalled();
          });
        });

        describe('and callback.onConfirmed throws an error', () => {
          let error;
          let callback;

          beforeEach(() => {
            error = { error: "boom" };
            callback = { 
              onConfirmed: sinon.stub().rejects(error), 
              onError: sinon.stub() 
            };
          });

          it('call callback.onConfirmed', async () => {
            await Story.confirmBeforeSaveIfNeeded(story, confirm, needConfirmation, callback);

            expect(callback.onConfirmed).toHaveBeenCalled();
          });

          it('call callback.onError', async () => {
            await Story.confirmBeforeSaveIfNeeded(story, confirm, needConfirmation, callback);

            expect(callback.onError).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
