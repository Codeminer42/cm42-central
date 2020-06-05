import { sendDefaultErrorNotification } from 'actions/notifications';
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
          _isDirty: true,
        },
      };

      const FakeStory = {
        findById: sinon.stub().returns(editedStory),
        update: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(false),
        withScope: sinon.stub().returns([story]),
        needConfirmation: sinon.stub().returns(false),
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)(
        fakeDispatch,
        fakeGetState,
        { Story: FakeStory },
      );

      expect(FakeStory.update).toHaveBeenCalledWith(
        editedStory._editing,
        projectId,
      );
    });

    it('dispatch only toggleStory when _isDirty is false', async () => {
      const editedStory = {
        ...story,
        _editing: {
          ...story,
          _isDirty: false,
        },
      };

      const FakeStory = {
        findById: sinon.stub().returns(editedStory),
        update: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(false),
        withScope: sinon.stub().returns([story]),
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)(
        fakeDispatch,
        fakeGetState,
        { Story: FakeStory },
      );

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.toggleStory(editedStory.id),
      );
      expect(fakeDispatch).not.toHaveBeenCalledWith(
        Story.updateStorySuccess(story),
      );
    });

    it('dispatch updateStorySuccess when _isDirty', async () => {
      const editedStory = {
        ...story,
        _editing: {
          ...story,
          _isDirty: true,
        },
      };

      const FakeStory = {
        findById: sinon.stub().returns(editedStory),
        update: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(false),
        withScope: sinon.stub().returns([story]),
        needConfirmation: sinon.stub().returns(false),
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)(
        fakeDispatch,
        fakeGetState,
        { Story: FakeStory },
      );

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.updateStorySuccess(story),
      );
    });

    it('dispatch only addStory when isNew', async () => {
      const editedStory = {
        ...story,
        _editing: {
          ...story,
        },
      };

      const FakeStory = {
        findById: sinon.stub().returns(editedStory),
        post: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(true),
        withScope: sinon.stub().returns([story]),
        needConfirmation: sinon.stub().returns(false),
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)(
        fakeDispatch,
        fakeGetState,
        { Story: FakeStory },
      );

      expect(fakeDispatch).toHaveBeenCalledWith(Story.addStory(story));
      expect(fakeDispatch).not.toHaveBeenCalledWith(
        Story.updateStorySuccess(story),
      );
      expect(fakeDispatch).not.toHaveBeenCalledWith(
        Story.toggleStory(editedStory.id),
      );
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: 'boom' };

      const editedStory = {
        ...story,
        _editing: {
          ...story,
          loading: true,
          _isDirty: true,
        },
      };

      const FakeStory = {
        findById: sinon.stub().returns(editedStory),
        update: sinon.stub().rejects(error),
        isNew: sinon.stub().returns(false),
        withScope: sinon.stub().returns([story]),
        needConfirmation: sinon.stub().returns(false),
      };

      const fakeDispatch = sinon.stub().resolves({});
      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)(
        fakeDispatch,
        fakeGetState,
        { Story: FakeStory },
      );

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.storyFailure(editedStory.id, error),
      );
    });
  });

  describe('deleteStory', () => {
    const storyId = 420;
    const projectId = 42;
    const story = { id: storyId, title: 'foo' };

    it('calls Story.deleteStory with projectId and storyId', async () => {
      const FakeStory = {
        findById: sinon.stub().returns(story),
        deleteStory: sinon.stub().resolves({}),
        withScope: sinon.stub().returns([story]),
      };
      const fakeGetState = sinon.stub().returns({
        stories: {
          all: [story],
        },
      });
      const fakeDispatch = sinon.stub().resolves({});

      await Story.deleteStory(storyId, projectId)(fakeDispatch, fakeGetState, {
        Story: FakeStory,
      });

      expect(FakeStory.deleteStory).toHaveBeenCalledWith(storyId, projectId);
    });

    it('dispatch deleteStorySuccess', async () => {
      const FakeStory = {
        findById: sinon.stub().returns(story),
        deleteStory: sinon.stub().resolves({}),
        withScope: sinon.stub().returns([story]),
      };
      const fakeGetState = sinon.stub().returns({
        stories: { all: [story] },
      });
      const fakeDispatch = sinon.stub().resolves({});

      await Story.deleteStory(storyId, projectId)(fakeDispatch, fakeGetState, {
        Story: FakeStory,
      });

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.deleteStorySuccess(storyId),
      );
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: 'boom' };

      const FakeStory = {
        findById: sinon.stub().returns(story),
        deleteStory: sinon.stub().rejects(error),
        withScope: sinon.stub().returns([story]),
      };
      const fakeGetState = sinon.stub().returns({
        stories: { all: [story] },
      });
      const fakeDispatch = sinon.stub().resolves({});

      await Story.deleteStory(storyId, projectId)(fakeDispatch, fakeGetState, {
        Story: FakeStory,
      });

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.storyFailure(storyId, error),
      );
    });
  });

  describe('highlight', () => {
    it('always dispatch updateHighlight', () => {
      const storyId = 1;
      const fakeDispatch = sinon.stub().resolves({});
      const fakeGetState = sinon.stub().returns({});

      Story.highlight(storyId)(fakeDispatch, fakeGetState, {});

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.updateHighlight(storyId, true),
      );
    });
  });

  describe('dragDropStory', () => {
    const story = storyFactory();
    const updatedStory = { ...story, position: 3.54 };
    const from = 1;

    it('calls Story.updateStorySuccess with new position', async () => {
      const FakeStory = {
        findById: sinon.stub().returns(updatedStory),
        update: sinon.stub().resolves(updatedStory),
        isNew: sinon.stub().returns(false),
        withScope: sinon.stub().returns([story]),
        addNewAttributes: sinon.stub().returns(story)
      };
      const fakeGetState = sinon.stub();
      fakeGetState.returns({
        stories: { all: [updatedStory] },
      });

      const fakeDispatch = sinon.stub().resolves({});

      await Story.dragDropStory(story.id, story.projectId, {
        position: 3.54,
      }, from)(fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.updateStorySuccess(updatedStory, from));

    });

    describe('when promise fails', () => {
      const error = { error: 'boom' };

      const FakeStory = {
        findById: sinon.stub().returns(updatedStory),
        update: sinon.stub().rejects(error),
        isNew: sinon.stub().returns(false),
        withScope: sinon.stub().returns([story]),
        addNewAttributes: sinon.stub().returns(story)
      };

      const fakeGetState = sinon.stub().returns({
        stories: { all: [updatedStory] },
      });

      const fakeDispatch = sinon.stub().resolves({});

      beforeEach(async () => {
        await Story.dragDropStory(story.id, story.projectId, {
          position: 3.54,
        })(fakeDispatch, fakeGetState, { Story: FakeStory });
      });

      it('dispatches storyFailure', () => {
        expect(fakeDispatch).toHaveBeenCalledWith(
          Story.storyFailure(updatedStory.id, error),
        );
      });

      it('do not dispatch updateStorySuccess', () => {
        expect(fakeDispatch).not.toHaveBeenCalledWith(
          Story.updateStorySuccess(updatedStory),
        );
      });
    });
  });

  describe('confirmBeforeSaveIfNeeded', () => {
    let story;

    beforeEach(() => {
      story = storyFactory();
    });

    describe('when do not need of confirmation', () => {
      let needConfirmation;
      let confirm;

      beforeEach(() => {
        needConfirmation = sinon.stub().returns(false);
        confirm = sinon.stub();
      });

      describe('and callback.onConfirmed do not throws an error', () => {
        it('call callback.onConfirmed', async () => {
          const callback = { onConfirmed: sinon.stub() };

          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback,
          );
          expect(callback.onConfirmed).toHaveBeenCalled();
        });
      });

      describe('and callback.onConfirmed throws an error', () => {
        let error;
        let callback;

        beforeEach(() => {
          error = { error: 'boom' };
          callback = {
            onConfirmed: sinon.stub().rejects(error),
            onError: sinon.stub(),
            onCanceled: sinon.stub(),
          };
        });

        it('call callback.onConfirmed', async () => {
          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback,
          );

          expect(callback.onConfirmed).toHaveBeenCalled();
        });

        it('call callback.onError', async () => {
          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback,
          );

          expect(callback.onError).toHaveBeenCalled();
        });

        it('do not call callback.onCanceled', async () => {
          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback,
          );

          expect(callback.onCanceled).not.toHaveBeenCalled();
        });
      });
    });

    describe('when need of confirmation', () => {
      describe('and is not confirmed', () => {
        let callback;
        let needConfirmation;
        let confirm;

        beforeEach(() => {
          callback = { onConfirmed: sinon.stub(), onCanceled: sinon.stub() };
          needConfirmation = sinon.stub().returns(true);
          confirm = sinon.stub().returns(false);
        });

        it('do not call callback.onConfirmed', async () => {
          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback,
          );

          expect(callback.onConfirmed).not.toHaveBeenCalled();
        });

        it('call callback.onCanceled', async () => {
          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback,
          );

          expect(callback.onCanceled).toHaveBeenCalled();
        });
      });

      describe('and is confirmed', () => {
        let needConfirmation;
        let confirm;

        beforeEach(() => {
          needConfirmation = sinon.stub().returns(true);
          confirm = sinon.stub().returns(true);
        });

        describe('and callback.onConfirmed do not throws an error', () => {
          it('call callback.onConfirmed', async () => {
            const callback = { onConfirmed: sinon.stub() };

            await Story.confirmBeforeSaveIfNeeded(
              story,
              confirm,
              needConfirmation,
              callback,
            );
            expect(callback.onConfirmed).toHaveBeenCalled();
          });
        });

        describe('and callback.onConfirmed throws an error', () => {
          let error;
          let callback;

          beforeEach(() => {
            error = { error: 'boom' };
            callback = {
              onConfirmed: sinon.stub().rejects(error),
              onError: sinon.stub(),
              onCanceled: sinon.stub(),
            };
          });

          it('call callback.onConfirmed', async () => {
            await Story.confirmBeforeSaveIfNeeded(
              story,
              confirm,
              needConfirmation,
              callback,
            );

            expect(callback.onConfirmed).toHaveBeenCalled();
          });

          it('call callback.onError', async () => {
            await Story.confirmBeforeSaveIfNeeded(
              story,
              confirm,
              needConfirmation,
              callback,
            );

            expect(callback.onError).toHaveBeenCalled();
          });

          it('do not call callback.onCanceled', async () => {
            await Story.confirmBeforeSaveIfNeeded(
              story,
              confirm,
              needConfirmation,
              callback,
            );

            expect(callback.onCanceled).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('fetchEpic', () => {
    let stories;
    let fakeGetState;
    let fakeDispatch;
    const label = 'label';

    beforeEach(() => {
      fakeGetState = jest.fn(() => ({ projectBoard: { projectId: 'test-project' } }));
      stories = Array(3).fill(storyFactory());
      fakeDispatch = jest.fn();
    });

    describe('when does not throws an error', () => {
      let fakeStory;

      beforeEach(() => {
        fakeStory = {
          getByLabel: jest.fn().mockResolvedValue(stories),
        };
      });

      it('dispatch receiveStories with stories in epic scope', async () => {
        await Story.fetchEpic(label)(fakeDispatch, fakeGetState, { Story: fakeStory });
    
        expect(fakeDispatch).toHaveBeenCalledWith(Story.receiveStories(stories, 'epic'));
      });

      it('does not dispatch sendDefaultErrorNotification', async () => {
        await Story.fetchEpic(label)(fakeDispatch, fakeGetState, { Story: fakeStory });
    
        expect(fakeDispatch).not.toHaveBeenCalledWith(sendDefaultErrorNotification());
      });
    });
  });
});
