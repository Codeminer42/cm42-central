import expandStoryIfNeeded from '../../../app/assets/javascripts/actions/projectBoard';

describe('Project Board Actions', () => {
  it('Should dispatch toggleHistory when storyId is true', async () => {
    const storyId = 127;

    const fakeGetHash = sinon.stub().returns(storyId);

    const fakeDispatch = sinon.stub().resolves({});

    await expandStoryIfNeeded(fakeDispatch, fakeGetHash);
    expect(fakeDispatch).toHaveBeenCalledWith(toggleStory(storyId));
  });

  it('Should not dispatch toggleHistory when storyId is false', async () => {
    const storyId = null;

    const fakeGetHash = sinon.stub().returns(storyId);

    const fakeDispatch = sinon.stub().resolves({});

    await expandStoryIfNeeded(fakeDispatch, fakeGetHash);
    expect(fakeDispatch).toHaveBeenCalledWith(toggleStory(storyId));
  });
});
