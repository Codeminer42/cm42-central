import * as actions from '../../../app/assets/javascripts/actions/story';
import actionTypes from '../../../app/assets/javascripts/actions/actionTypes';
import history from '../support/factories/historyFactory';
import story from '../support/factories/storyFactory';
import expandStoryIfNeeded from '../../../app/assets/javascripts/actions/projectBoard';

describe('History Actions', () => {
  it('Should load a new history when called showHistory action', async () => {
    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub();

    const FakeStory = {
      findById: sinon.stub().returns(story()),
      getHistory: sinon.stub().resolves(history())
    };

    fakeGetState.returns({ stories: [story()] });

    await actions.showHistory(story().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory
    });

    expect(fakeDispatch).toHaveBeenCalledWith(actions.loadHistory('title'));
  });

  it('Should receive a history when called showHistory action', async () => {
    const FakeStory = {
      findById: sinon.stub().returns(story()),
      getHistory: sinon.stub().resolves(history())
    };

    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub().returns({ stories: [story()] });

    await actions.showHistory(story().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory
    });

    expect(fakeDispatch).toHaveBeenCalledWith(
      actions.receiveHistory(history(), 'title')
    );
  });

  it('Should dispatch errorLoadHistory when called showHistory action', async () => {
    const FakeStory = {
      findById: sinon.stub().returns(story()),
      getHistory: sinon.stub().rejects('error')
    };

    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub().returns({ stories: [story()] });

    await actions.showHistory(story().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory
    });
    expect(fakeDispatch).toHaveBeenCalledWith(actions.errorLoadHistory());
  });

  it('Should dispatch toggleHistory when storyId is true', async () => {
    const storyId = 127;

    const fakeGetHash = sinon.stub().returns(storyId);

    const fakeDispatch = sinon.stub().resolves({});

    await expandStoryIfNeeded(fakeDispatch, fakeGetHash);
    expect(fakeDispatch).toHaveBeenCalledWith(toggleStory(storyId));
  })

  it('Should not dispatch toggleHistory when storyId is false', async () => {
    const storyId = null;

    const fakeGetHash = sinon.stub().returns(storyId);

    const fakeDispatch = sinon.stub().resolves({});

    await expandStoryIfNeeded(fakeDispatch, fakeGetHash);
    expect(fakeDispatch).toHaveBeenCalledWith(toggleStory(storyId));
  })
});
