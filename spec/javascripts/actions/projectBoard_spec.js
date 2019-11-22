import * as ProjectBoard from '../../../app/assets/javascripts/actions/projectBoard';
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
    
        ProjectBoard.expandStoryIfNeeded(fakeDispatch, fakeGetHash);
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
    
        ProjectBoard.expandStoryIfNeeded(fakeDispatch, fakeGetHash);
        expect(fakeDispatch).not.toHaveBeenCalledWith(toggleStory(storyId));
      });
    });
  });

  describe('sendErrorNotificationIfNeeded', () => {
    describe('when condition is true', () => {
      it('calls "dispatch"', () => {
        const condition = true;
        const code = 'code';
  
        const fakeDispatch = sinon.stub();
        fakeDispatch.resolves({});
  
        ProjectBoard.sendErrorNotificationIfNeeded(fakeDispatch, code, condition);
        expect(fakeDispatch).toHaveBeenCalled();
      });
    });
  
    describe('when condition is false', () => {
      it('does not call "dispatch"', () => {
        const condition = false;
        const code = 'code';
  
        const fakeDispatch = sinon.stub();
        fakeDispatch.resolves({});
  
        ProjectBoard.sendErrorNotificationIfNeeded(fakeDispatch, code, condition);  
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

      ProjectBoard.closeSearch()
        (fakeDispatch, fakeGetState, {});
    });

    it('dispatch closeSearchSuccess', () => {
      expect(fakeDispatch).toHaveBeenCalledWith(ProjectBoard.closeSearchSuccess());
    });

    it('dispatch receiveStories', () => {
      expect(fakeDispatch).toHaveBeenCalledWith(receiveStories([], 'search'));
    });
  });

  describe('search', () => {
    describe('when search is invalid', () => {
      const fakeDispatch = sinon.stub();

      const keyword = '';
      const projectId = 1;

      const FakeSearch = { 
        searchStories: sinon.stub()
      };

      ProjectBoard.search(keyword, projectId)(
        fakeDispatch,
        null,
        { 
          Search: FakeSearch,
        }
      );

      it('does nothing', () => {
        expect(fakeDispatch).not.toHaveBeenCalled();
      });
    });

    describe('when search is valid', () => {
      const fakeDispatch = sinon.stub();
      const result = [];

      const keyword = 'keyword';
      const projectId = 1;

      const FakeSearch = { 
        searchStories: (_, __, callback) => callback.onSuccess(result)
      };

      ProjectBoard.search(keyword, projectId)(
        fakeDispatch,
        null,
        { 
          Search: FakeSearch,
        }
      );

      it('dispatch updateLoadingSearch with false', () => {
        expect(fakeDispatch).toHaveBeenCalledWith(ProjectBoard.updateLoadingSearch(false));
      });

      it('dispatch searchStoriesSuccess with keyword', () => {
        expect(fakeDispatch).toHaveBeenCalledWith(ProjectBoard.searchStoriesSuccess(keyword));
      });

      it('dispatch receiveStories with search and result', () => {
        expect(fakeDispatch).toHaveBeenCalledWith(receiveStories(result, 'search'));
      });
    });
  });

  describe('reverseColumnsProjectBoard', () => {
    const fakeDispatch = sinon.stub();

    it('always dispatch reverseColumns', () => {
      ProjectBoard.reverseColumnsProjectBoard()(fakeDispatch);

      expect(fakeDispatch).toHaveBeenCalledWith(ProjectBoard.reverseColumns());
    });
  });
});
