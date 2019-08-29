import * as actions from '../../../app/assets/javascripts/actions/story';
import actionTypes from '../../../app/assets/javascripts/actions/actionTypes';
import history from '../support/factories/historyFactory';
import storie from '../support/factories/storyFactory';

describe('History Actions', () => {
  it('Should load a new history when called showHistory action', async () => {
    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub();

    const FakeStory = {
      findById: sinon.stub().returns(storie()),
      getHistory: sinon.stub().resolves(history())
    };

    fakeGetState.returns({ stories: [storie()] });

    await actions.showHistory(storie().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory
    });

    expect(fakeDispatch).toHaveBeenCalledWith(actions.loadHistory('title'));
  });

  it('Should receive a history when called showHistory action', async () => {
    const FakeStory = {
      findById: sinon.stub().returns(storie()),
      getHistory: sinon.stub().resolves(history())
    };

    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub().returns({ stories: [storie()] });

    await actions.showHistory(storie().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory
    });

    expect(fakeDispatch).toHaveBeenCalledWith(
      actions.receiveHistory(history(), 'title')
    );
  });

  it('Should dispatch errorLoadHistory when called showHistory action', async () => {
    const FakeStory = {
      findById: sinon.stub().returns(storie()),
      getHistory: sinon.stub().rejects('error')
    };

    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub().returns({ stories: [storie()] });

    await actions.showHistory(storie().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory
    });
    expect(fakeDispatch).toHaveBeenCalledWith(actions.errorLoadHistory());
  });
});
