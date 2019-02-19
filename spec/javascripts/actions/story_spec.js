import * as Story from 'actions/story';
import storyFactory from '../support/factories/storyFactory';

describe('saveStory', () => {
  const story = storyFactory();
  const projectId = 42;

  it('calls Story.update with story._editing and projectId', (done) => {
    const editedStory = {
      ...story,
      _editing: {
        ...story,
        _isDirty: true
      }
    };

    const FakeStory = {
      update: sinon.stub().resolves(story),
      isNew: sinon.stub().returns(false)
    };

    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub();
    fakeGetState.returns({ stories: [editedStory] });

    Story.saveStory(editedStory.id, projectId)(fakeDispatch, fakeGetState, { Story: FakeStory }).then(() => {
      expect(FakeStory.update).toHaveBeenCalledWith(editedStory._editing, projectId);

      done();
    });
  });

  it('dispatch only toggleStory when _isDirty is false', (done) => {
    const editedStory = {
      ...story,
      _editing: {
        ...story,
        _isDirty: false
      }
    };

    const FakeStory = {
      update: sinon.stub().resolves(story),
      isNew: sinon.stub().returns(false)
    };

    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub();
    fakeGetState.returns({ stories: [editedStory] });

    Story.saveStory(editedStory.id, projectId)(fakeDispatch, fakeGetState, { Story: FakeStory }).then(() => {
      expect(fakeDispatch).toHaveBeenCalledWith(Story.toggleStory(editedStory.id));
      expect(fakeDispatch).not.toHaveBeenCalledWith(Story.updateStorySuccess(story));

      done();
    });
  });

  it('dispatch updateStorySuccess when _isDirty', (done) => {
    const editedStory = {
      ...story,
      _editing: {
        ...story,
        _isDirty: true
      }
    };

    const FakeStory = {
      update: sinon.stub().resolves(story),
      isNew: sinon.stub().returns(false)
    };

    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub();
    fakeGetState.returns({ stories: [editedStory] });

    Story.saveStory(editedStory.id, projectId)(fakeDispatch, fakeGetState, { Story: FakeStory }).then(() => {
      expect(fakeDispatch).toHaveBeenCalledWith(Story.updateStorySuccess(story));

      done();
    });
  });

  it('dispatch only addStory when isNew', (done) => {
    const editedStory = {
      ...story,
      _editing: {
        ...story
      }
    };

    const FakeStory = {
      post: sinon.stub().resolves(story),
      isNew: sinon.stub().returns(true)
    };

    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub();
    fakeGetState.returns({ stories: [editedStory] });

    Story.saveStory(editedStory.id, projectId)(fakeDispatch, fakeGetState, { Story: FakeStory }).then(() => {
      expect(fakeDispatch).toHaveBeenCalledWith(Story.addStory(story));
      expect(fakeDispatch).not.toHaveBeenCalledWith(Story.updateStorySuccess(story));
      expect(fakeDispatch).not.toHaveBeenCalledWith(Story.toggleStory(editedStory.id));

      done();
    });
  });

  it('dispatches storyFailure when promise fails', (done) => {
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
      update: sinon.stub().rejects(error)
    };

    const fakeDispatch = sinon.stub().resolves({});
    const fakeGetState = sinon.stub();
    fakeGetState.returns({ stories: [editedStory] });

    Story.updateStory(editedStory.id, projectId)(fakeDispatch, fakeGetState, { Story: FakeStory }).then(() => {
      expect(fakeDispatch).toHaveBeenCalledWith(Story.storyFailure(editedStory.id, error));

      done();
    });
  });
});

describe('deleteStory', () => {
  const storyId = 420;
  const projectId = 42;

  it('calls Story.deleteStory with projectId and storyId', (done) => {
    const FakeStory = {
      deleteStory: sinon.stub().resolves({})
    };

    const fakeDispatch = sinon.stub().resolves({});

    Story.deleteStory(storyId, projectId)(fakeDispatch, null, { Story: FakeStory }).then(() => {
      expect(FakeStory.deleteStory).toHaveBeenCalledWith(storyId, projectId);

      done();
    });
  });

  it('dispatch deleteStorySuccess', (done) => {
    const FakeStory = {
      deleteStory: sinon.stub().resolves({})
    };

    const fakeDispatch = sinon.stub().resolves({});

    Story.deleteStory(storyId, projectId)(fakeDispatch, null, { Story: FakeStory }).then(() => {
      expect(fakeDispatch).toHaveBeenCalledWith(Story.deleteStorySuccess(storyId));

      done();
    });
  });

  it('dispatches storyFailure when promise fails', (done) => {
    const error = { error: "boom" };

    const FakeStory = {
      deleteStory: sinon.stub().rejects(error)
    };

    const fakeDispatch = sinon.stub().resolves({});

    Story.deleteStory(storyId, projectId)(fakeDispatch, null, { Story: FakeStory }).then(() => {
      expect(fakeDispatch).toHaveBeenCalledWith(Story.storyFailure(storyId, error));

      done();
    });
  });
});
