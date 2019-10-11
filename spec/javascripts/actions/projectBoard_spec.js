import { 
  expandStoryIfNeeded, closeSearch, 
  closeSearchSuccess 
} from '../../../app/assets/javascripts/actions/projectBoard';
import { toggleStory, receiveStories } from '../../../app/assets/javascripts/actions/story';

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
    expect(fakeDispatch).not.toHaveBeenCalledWith(toggleStory(storyId));
  });

  describe('closeSearch', () => {
    let fakeDispatch;
    let fakeGetState;

    beforeEach(() => {
      fakeDispatch = sinon.stub();
      fakeDispatch.resolves({});

      fakeGetState = sinon.stub();
      fakeGetState.returns({});

      closeSearch()
        (fakeDispatch, fakeGetState, {});
    });

    it('Should dispatch closeSearchSuccess', () => {
      expect(fakeDispatch).toHaveBeenCalledWith(closeSearchSuccess());
    });

    it('Should dispatch receiveStories', () => {
      expect(fakeDispatch).toHaveBeenCalledWith(receiveStories([], 'search'));
    });
  });
});
