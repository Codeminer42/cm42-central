import * as Story from 'actions/story';
import storyFactory from '../support/factories/storyFactory';

describe('updateStory', () => {
  const story = storyFactory();
  const projectId = 42;

  it('Calls Story.update with story._editing and projectId', (done) => {
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

  it('dispatch toggleStory and updateStorySuccess when _isDirty', (done) => {
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
      expect(fakeDispatch).toHaveBeenCalledWith(Story.toggleStory(editedStory.id));
      expect(fakeDispatch).toHaveBeenCalledWith(Story.updateStorySuccess(story));

      done();
    });
  });
});
