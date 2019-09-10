import { expandStoryIfNeeded } from '../../../app/assets/javascripts/actions/projectBoard';
import { toggleStory } from '../../../app/assets/javascripts/actions/story';

describe('Project Board Actions', () => {
  it('Should dispatch toggleStory when storyId is true', async () => {
    const storyId = 127;

    const fakeGetHash = sinon.stub();
    fakeGetHash.returns(storyId);

    const fakeDispatch = sinon.stub();
    fakeDispatch.resolves({});

    await expandStoryIfNeeded(fakeDispatch, fakeGetHash);
    expect(fakeDispatch).toHaveBeenCalledWith(toggleStory(storyId));
  });

  it('Should not dispatch toggleStory when storyId is false', async () => {
    const storyId = null;

    const fakeGetHash = sinon.stub();
    fakeGetHash.returns(storyId);

    const fakeDispatch = sinon.stub();
    fakeDispatch.resolves({});

    await expandStoryIfNeeded(fakeDispatch, fakeGetHash);
    expect(fakeDispatch).toHaveBeenCalledWith(toggleStory(storyId));
  });
});
