import { 
  expandStoryIfNeeded, closeSearch, 
  closeSearchSuccess, sendErrorNotificationIfNeeded
} from '../../../app/assets/javascripts/actions/projectBoard';
import { toggleStory, receiveStories } from '../../../app/assets/javascripts/actions/story';

describe('Project Board Actions', () => {
  describe('expandStoryIfNeeded', () => {
    describe('when storyId is true', () => {
      it('dispatch toggleStory', () => {
        const storyId = 127;
    
        const fakeGetHash = sinon.stub();
        fakeGetHash.returns(storyId);
    
        const fakeDispatch = sinon.stub();
        fakeDispatch.resolves({});
    
        expandStoryIfNeeded(fakeDispatch, fakeGetHash);
        expect(fakeDispatch).toHaveBeenCalledWith(toggleStory(storyId));
      });
    });
  
    describe('when storyId is false', () => {
      it('does not dispatch toggleStory', () => {
        const storyId = null;
    
        const fakeGetHash = sinon.stub();
        fakeGetHash.returns(storyId);
    
        const fakeDispatch = sinon.stub();
        fakeDispatch.resolves({});
    
        expandStoryIfNeeded(fakeDispatch, fakeGetHash);
        expect(fakeDispatch).not.toHaveBeenCalledWith(toggleStory(storyId));
      });
    });
  });

  describe('sendErrorNotificationIfNeeded', () => {
    describe('when condition is false', () => {
      it('calls "dispatch"', () => {
        const condition = false;
        const code = 'code';
  
        const fakeDispatch = sinon.stub();
        fakeDispatch.resolves({});
  
        sendErrorNotificationIfNeeded(fakeDispatch, code, condition);
        expect(fakeDispatch).toHaveBeenCalled();
      });
    });
  
    describe('when condition is true', () => {
      it('does not call "dispatch"', () => {
        const condition = true;
        const code = 'code';
  
        const fakeDispatch = sinon.stub();
        fakeDispatch.resolves({});
  
        sendErrorNotificationIfNeeded(fakeDispatch, code, condition);  
        expect(fakeDispatch).not.toHaveBeenCalled();
      });
    });
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

    it('dispatch closeSearchSuccess', () => {
      expect(fakeDispatch).toHaveBeenCalledWith(closeSearchSuccess());
    });

    it('dispatch receiveStories', () => {
      expect(fakeDispatch).toHaveBeenCalledWith(receiveStories([], 'search'));
    });
  });
});
