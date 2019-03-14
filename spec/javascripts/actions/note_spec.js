import * as Note from 'actions/note';
import * as Story from 'actions/story';

describe('Note Actions', () => {
  describe('createNote', () => {
    const note = { id: 42, note: 'testNote' }
    const projectId = 42;
    const storyId = 420;

    it('calls FakeNote.post with projectId, storyId and note', async () => {
      const FakeNote = {
        post: sinon.stub().resolves(note)
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Note.createNote(projectId, storyId, note)
        (fakeDispatch, null, { Note: FakeNote });

      expect(FakeNote.post).toHaveBeenCalledWith(projectId, storyId, note);
    });

    it('dispatch createNoteSuccess with storyId and note', async () => {
      const FakeNote = {
        post: sinon.stub().resolves(note)
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Note.createNote(projectId, storyId, note)
        (fakeDispatch, null, { Note: FakeNote });

      expect(fakeDispatch).toHaveBeenCalledWith(Note.createNoteSuccess(storyId, note));
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: "boom" };

      const FakeNote = {
        post: sinon.stub().rejects(error)
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Note.createNote(projectId, storyId, note)
        (fakeDispatch, null, { Note: FakeNote });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.storyFailure(storyId, error));
    });
  });

  describe('deleteNote', () => {
    const noteId = 41;
    const projectId = 42;
    const storyId = 420;

    it('calls FakeNote.destroy with projectId, storyId and noteId', async () => {
      const FakeNote = {
        destroy: sinon.stub().resolves({})
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Note.deleteNote(projectId, storyId, noteId)
        (fakeDispatch, null, { Note: FakeNote });

      expect(FakeNote.destroy).toHaveBeenCalledWith(projectId, storyId, noteId);
    });

    it('dispatch deleteNoteSuccess with storyId and noteId', async () => {
      const FakeNote = {
        destroy: sinon.stub().resolves({})
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Note.deleteNote(projectId, storyId, noteId)
        (fakeDispatch, null, { Note: FakeNote });

      expect(fakeDispatch).toHaveBeenCalledWith(Note.deleteNoteSuccess(storyId, noteId));
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: "boom" };

      const FakeNote = {
        destroy: sinon.stub().rejects(error)
      };

      const fakeDispatch = sinon.stub().resolves({});


      await Note.deleteNote(projectId, storyId, noteId)
        (fakeDispatch, null, { Note: FakeNote });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.storyFailure(storyId, error));
    });
  });
})
