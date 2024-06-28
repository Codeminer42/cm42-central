import * as actions from "../../../app/assets/javascripts/actions/story";
import history from "../support/factories/historyFactory";
import story from "../support/factories/storyFactory";

describe("History Actions", () => {
  it("Should load a new history when called showHistory action", async () => {
    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub();

    const FakeStory = {
      findById: sinon.stub().returns(story()),
      getHistory: sinon.stub().resolves(history()),
      withScope: sinon.stub().returns([story()]),
      denormalizeState: sinon.stub().returns({ all: [story()] }),
    };

    fakeGetState.returns({ stories: { all: [story()] } });

    await actions.showHistory(story().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory,
    });

    expect(fakeDispatch).toHaveBeenCalledWith(actions.loadHistory("title"));
  });

  it("Should receive a history when called showHistory action", async () => {
    const FakeStory = {
      findById: sinon.stub().returns(story()),
      getHistory: sinon.stub().resolves(history()),
      withScope: sinon.stub().returns([story()]),
      denormalizeState: sinon.stub().returns({ all: [story()] }),
    };

    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub().returns({ stories: { all: [story()] } });

    await actions.showHistory(story().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory,
    });

    expect(fakeDispatch).toHaveBeenCalledWith(
      actions.receiveHistory(history(), "title")
    );
  });

  it("Should dispatch errorLoadHistory when called showHistory action", async () => {
    const FakeStory = {
      findById: sinon.stub().returns(story()),
      getHistory: sinon.stub().rejects("error"),
      withScope: sinon.stub().returns([story()]),
      denormalizeState: sinon.stub().returns({ all: [story()] }),
    };

    const fakeDispatch = sinon.stub().resolves({});

    const fakeGetState = sinon.stub().returns({ stories: { all: [story()] } });

    await actions.showHistory(story().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory,
    });
    expect(fakeDispatch).toHaveBeenCalledWith(actions.errorLoadHistory());
  });
});
