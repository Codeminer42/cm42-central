import * as Story from 'actions/story';
import storyFactory from '../support/factories/storyFactory';

describe('updateStory', () => {
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
      update: sinon.stub().resolves(story)
    };

    const fakeDispatch = sinon.stub().resolves({});

    Story.updateStory(editedStory, projectId)(fakeDispatch, null, { Story: FakeStory }).then(() => {
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
      update: sinon.stub().resolves(story)
    };

    const fakeDispatch = sinon.stub().resolves({});

    Story.updateStory(editedStory, projectId)(fakeDispatch, null, { Story: FakeStory }).then(() => {
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
      update: sinon.stub().resolves(story)
    };

    const fakeDispatch = sinon.stub().resolves({});

    Story.updateStory(editedStory, projectId)(fakeDispatch, null, { Story: FakeStory }).then(() => {
      expect(fakeDispatch).toHaveBeenCalledWith(Story.updateStorySuccess(story));

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
});
