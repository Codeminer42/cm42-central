import { sendDefaultErrorNotification } from 'actions/notifications';
import * as Story from 'actions/story';
import storyFactory from '../support/factories/storyFactory';

vi.mock('../../../app/assets/javascripts/reducers/stories', () => ({
  storiesWithScope: vi.fn(),
}));

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
        findById: vi.fn().mockReturnValue(editedStory),
        update: vi.fn().mockResolvedValue(story),
        isNew: vi.fn().mockReturnValue(false),
        needConfirmation: vi.fn().mockReturnValue(false),
      };

      const fakeDispatch = vi.fn().mockResolvedValue({});

      const fakeGetState = vi.fn();
      fakeGetState.mockReturnValue({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)(
        fakeDispatch,
        fakeGetState,
        { Story: FakeStory }
      );

      expect(FakeStory.update).toHaveBeenCalledWith(
        editedStory._editing,
        projectId,
        undefined
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
        findById: vi.fn().mockReturnValue(editedStory),
        update: vi.fn().mockResolvedValue(story),
        isNew: vi.fn().mockReturnValue(false),
      };

      const fakeDispatch = vi.fn().mockResolvedValue({});

      const fakeGetState = vi.fn();
      fakeGetState.mockReturnValue({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)(
        fakeDispatch,
        fakeGetState,
        { Story: FakeStory }
      );

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.toggleStory(editedStory.id)
      );
      expect(fakeDispatch).not.toHaveBeenCalledWith(
        Story.updateStorySuccess(story)
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
        findById: vi.fn().mockReturnValue(editedStory),
        update: vi.fn().mockResolvedValue(story),
        isNew: vi.fn().mockReturnValue(false),
        needConfirmation: vi.fn().mockReturnValue(false),
      };

      const fakeDispatch = vi.fn().mockResolvedValue({});

      const fakeGetState = vi.fn();
      fakeGetState.mockReturnValue({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)(
        fakeDispatch,
        fakeGetState,
        { Story: FakeStory }
      );

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.updateStorySuccess(story)
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
        findById: vi.fn().mockReturnValue(editedStory),
        post: vi.fn().mockResolvedValue(story),
        isNew: vi.fn().mockReturnValue(true),
        needConfirmation: vi.fn().mockReturnValue(false),
        getHighestNewPosition: vi.fn().mockReturnValue(1),
      };

      const fakeDispatch = vi.fn().mockResolvedValue({});

      const fakeGetState = vi.fn();
      fakeGetState.mockReturnValue({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)(
        fakeDispatch,
        fakeGetState,
        { Story: FakeStory }
      );

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.addStory({ story, id: editedStory.id })
      );
      expect(fakeDispatch).not.toHaveBeenCalledWith(
        Story.updateStorySuccess(story)
      );
      expect(fakeDispatch).not.toHaveBeenCalledWith(
        Story.toggleStory(editedStory.id)
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
        findById: vi.fn().mockReturnValue(editedStory),
        update: vi.fn().mockRejectedValue(error),
        isNew: vi.fn().mockReturnValue(false),
        needConfirmation: vi.fn().mockReturnValue(false),
      };

      const fakeDispatch = vi.fn().mockResolvedValue({});
      const fakeGetState = vi.fn();
      fakeGetState.mockReturnValue({ stories: { all: [editedStory] } });

      await Story.saveStory(editedStory.id, projectId)(
        fakeDispatch,
        fakeGetState,
        { Story: FakeStory }
      );

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.storyFailure(editedStory.id, error)
      );
    });
  });

  describe('deleteStory', () => {
    const storyId = 420;
    const projectId = 42;
    const story = { id: storyId, title: 'foo' };

    it('calls Story.deleteStory with projectId and storyId', async () => {
      const FakeStory = {
        findById: vi.fn().mockReturnValue(story),
        deleteStory: vi.fn().mockResolvedValue({}),
      };
      const fakeGetState = vi.fn().mockReturnValue({
        stories: {
          all: [story],
        },
      });
      const fakeDispatch = vi.fn().mockResolvedValue({});

      await Story.deleteStory(storyId, projectId)(fakeDispatch, fakeGetState, {
        Story: FakeStory,
      });

      expect(FakeStory.deleteStory).toHaveBeenCalledWith(storyId, projectId);
    });

    it('dispatch deleteStorySuccess', async () => {
      const FakeStory = {
        findById: vi.fn().mockReturnValue(story),
        deleteStory: vi.fn().mockResolvedValue({}),
      };
      const fakeGetState = vi.fn().mockReturnValue({
        stories: { all: [story] },
      });
      const fakeDispatch = vi.fn().mockResolvedValue({});

      await Story.deleteStory(storyId, projectId)(fakeDispatch, fakeGetState, {
        Story: FakeStory,
      });

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.deleteStorySuccess(storyId)
      );
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: 'boom' };

      const FakeStory = {
        findById: vi.fn().mockReturnValue(story),
        deleteStory: vi.fn().mockRejectedValue(error),
      };
      const fakeGetState = vi.fn().mockReturnValue({
        stories: { all: [story] },
      });
      const fakeDispatch = vi.fn().mockResolvedValue({});

      await Story.deleteStory(storyId, projectId)(fakeDispatch, fakeGetState, {
        Story: FakeStory,
      });

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.storyFailure(storyId, error)
      );
    });
  });

  describe('highlight', () => {
    it('always dispatch updateHighlight', () => {
      const storyId = 1;
      const fakeDispatch = vi.fn().mockResolvedValue({});
      const fakeGetState = vi.fn().mockReturnValue({});

      Story.highlight(storyId)(fakeDispatch, fakeGetState, {});

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.updateHighlight(storyId, true)
      );
    });
  });

  describe('dragDropStory', () => {
    const story = storyFactory();
    const updatedStories = [
      { ...story, newPosition: 4, id: 42 },
      { ...story, newPosition: 6, id: 43 },
    ];
    const updatedStory = { ...story, newPosition: 4 };
    const from = 1;

    it('calls Story.sortStories with new position', async () => {
      const FakeStory = {
        findById: vi.fn().mockReturnValue(updatedStory),
        updatePosition: vi.fn().mockResolvedValue(updatedStories),
        isNew: vi.fn().mockReturnValue(false),
        addNewAttributes: vi.fn().mockReturnValue(story),
        sortOptimistically: vi.fn().mockResolvedValue(updatedStories),
      };
      const fakeGetState = vi.fn().mockReturnValue({
        stories: { all: updatedStories },
      });

      const fakeDispatch = vi.fn().mockResolvedValue({});

      await Story.dragDropStory(
        story.id,
        story.projectId,
        {
          position: 3.54,
          newPosition: 4,
        },
        from
      )(fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.sortStories(updatedStories, from)
      );
    });

    describe('when promise fails', () => {
      const error = { error: 'boom' };

      const FakeStory = {
        findById: vi.fn().mockReturnValue(updatedStory),
        updatePosition: vi.fn().mockRejectedValue(error),
        isNew: vi.fn().mockReturnValue(false),
        addNewAttributes: vi.fn().mockReturnValue(story),
        sortOptimistically: vi.fn().mockReturnValue(updatedStory),
      };

      const fakeGetState = vi.fn().mockReturnValue({
        stories: { all: updatedStories },
      });

      const fakeDispatch = vi.fn().mockResolvedValue({});

      beforeEach(async () => {
        await Story.dragDropStory(story.id, story.projectId, {
          position: 3.54,
        })(fakeDispatch, fakeGetState, { Story: FakeStory });
      });

      it('dispatches storyFailure', () => {
        expect(fakeDispatch).toHaveBeenCalledWith(
          Story.storyFailure(updatedStory.id, error)
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
        needConfirmation = vi.fn().mockReturnValue(false);
        confirm = vi.fn();
      });

      describe('and callback.onConfirmed do not throws an error', () => {
        it('call callback.onConfirmed', async () => {
          const callback = { onConfirmed: vi.fn() };

          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback
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
            onConfirmed: vi.fn().mockRejectedValue(error),
            onError: vi.fn(),
            onCanceled: vi.fn(),
          };
        });

        it('call callback.onConfirmed', async () => {
          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback
          );

          expect(callback.onConfirmed).toHaveBeenCalled();
        });

        it('call callback.onError', async () => {
          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback
          );

          expect(callback.onError).toHaveBeenCalled();
        });

        it('do not call callback.onCanceled', async () => {
          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback
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
          callback = { onConfirmed: vi.fn(), onCanceled: vi.fn() };
          needConfirmation = vi.fn().mockReturnValue(true);
          confirm = vi.fn().mockReturnValue(false);
        });

        it('do not call callback.onConfirmed', async () => {
          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback
          );

          expect(callback.onConfirmed).not.toHaveBeenCalled();
        });

        it('call callback.onCanceled', async () => {
          await Story.confirmBeforeSaveIfNeeded(
            story,
            confirm,
            needConfirmation,
            callback
          );

          expect(callback.onCanceled).toHaveBeenCalled();
        });
      });

      describe('and is confirmed', () => {
        let needConfirmation;
        let confirm;

        beforeEach(() => {
          needConfirmation = vi.fn().mockResolvedValue(true);
          confirm = vi.fn().mockResolvedValue(true);
        });

        describe('and callback.onConfirmed do not throws an error', () => {
          it('call callback.onConfirmed', async () => {
            const callback = { onConfirmed: vi.fn() };

            await Story.confirmBeforeSaveIfNeeded(
              story,
              confirm,
              needConfirmation,
              callback
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
              onConfirmed: vi.fn().mockRejectedValue(error),
              onError: vi.fn(),
              onCanceled: vi.fn(),
            };
          });

          it('call callback.onConfirmed', async () => {
            await Story.confirmBeforeSaveIfNeeded(
              story,
              confirm,
              needConfirmation,
              callback
            );

            expect(callback.onConfirmed).toHaveBeenCalled();
          });

          it('call callback.onError', async () => {
            await Story.confirmBeforeSaveIfNeeded(
              story,
              confirm,
              needConfirmation,
              callback
            );

            expect(callback.onError).toHaveBeenCalled();
          });

          it('do not call callback.onCanceled', async () => {
            await Story.confirmBeforeSaveIfNeeded(
              story,
              confirm,
              needConfirmation,
              callback
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
      fakeGetState = vi.fn(() => ({
        projectBoard: { projectId: 'test-project' },
      }));
      stories = Array(3).fill(storyFactory());
      fakeDispatch = vi.fn();
    });

    describe('when does not throws an error', () => {
      let fakeStory;

      beforeEach(() => {
        fakeStory = {
          getByLabel: vi.fn().mockResolvedValue(stories),
        };
      });

      it('dispatch receiveStories with stories in epic scope', async () => {
        await Story.fetchEpic(label)(fakeDispatch, fakeGetState, {
          Story: fakeStory,
        });

        expect(fakeDispatch).toHaveBeenCalledWith(
          Story.receiveStories(stories, 'epic')
        );
      });

      it('does not dispatch sendDefaultErrorNotification', async () => {
        await Story.fetchEpic(label)(fakeDispatch, fakeGetState, {
          Story: fakeStory,
        });

        expect(fakeDispatch).not.toHaveBeenCalledWith(
          sendDefaultErrorNotification()
        );
      });
    });
  });
});
