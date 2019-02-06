import * as Note from 'actions/note';
import * as Story from 'actions/story';

describe('Note Actions', () => {
  describe('createNote', () => {
    const note = { id: 42, note: 'testNote' }
    const projectId = 42;
    const storyId = 420;

    it('calls FakeNote.post with projectId, storyId and note', (done) => {
      const FakeNote = {
        post: sinon.stub().resolves(note)
      };

      const fakeDispatch = sinon.stub().resolves({});

      Note.createNote(projectId, storyId, note)(fakeDispatch, null, { Note: FakeNote })
        .then(() => {
          expect(FakeNote.post).toHaveBeenCalledWith(projectId, storyId, note);

          done();
        });
    });

    it('dispatch createNoteSuccess with storyId and note', (done) => {
      const FakeNote = {
        post: sinon.stub().resolves(note)
      };

      const fakeDispatch = sinon.stub().resolves({});

      Note.createNote(projectId, storyId, note)(fakeDispatch, null, { Note: FakeNote })
        .then(() => {
          expect(fakeDispatch).toHaveBeenCalledWith(Note.createNoteSuccess(storyId, note));

          done();
        });
    });

    it('dispatches setLoadingStory when promise fails', (done) => {
      const FakeNote = {
        post: sinon.stub().rejects()
      };

      const fakeDispatch = sinon.stub().resolves({});

      Note.createNote(projectId, storyId, note)(fakeDispatch, null, { Note: FakeNote })
        .then(() => {
          expect(fakeDispatch).toHaveBeenCalledWith(Story.setLoadingStory(storyId));

          done();
        });
    });
  });

  describe('deleteNote', () => {
    const noteId = 41;
    const projectId = 42;
    const storyId = 420;

    it('calls FakeNote.destroy with projectId, storyId and noteId', (done) => {
      const FakeNote = {
        destroy: sinon.stub().resolves({})
      };

      const fakeDispatch = sinon.stub().resolves({});

      Note.deleteNote(projectId, storyId, noteId)(fakeDispatch, null, { Note: FakeNote })
        .then(() => {
          expect(FakeNote.destroy).toHaveBeenCalledWith(projectId, storyId, noteId);

          done();
        });
    });

    it('dispatch deleteNoteSuccess with storyId and noteId', (done) => {
      const FakeNote = {
        destroy: sinon.stub().resolves({})
      };

      const fakeDispatch = sinon.stub().resolves({});

      Note.deleteNote(projectId, storyId, noteId)(fakeDispatch, null, { Note: FakeNote })
        .then(() => {
          expect(fakeDispatch).toHaveBeenCalledWith(Note.deleteNoteSuccess(storyId, noteId));

          done();
        });
    });

    it('dispatches setLoadingStory when promise fails', (done) => {
      const FakeNote = {
        destroy: sinon.stub().rejects()
      };

      const fakeDispatch = sinon.stub().resolves({});

      Note.deleteNote(projectId, storyId, noteId)(fakeDispatch, null, { Note: FakeNote })
        .then(() => {
          expect(fakeDispatch).toHaveBeenCalledWith(Story.setLoadingStory(storyId));

          done();
        });
    });
  });
})
