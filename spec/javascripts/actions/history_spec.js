import * as actions from '../../../app/assets/javascripts/actions/story';
import history from '../support/factories/historyFactory';
import story from '../support/factories/storyFactory';

describe('History Actions', () => {
  it('Should load a new history when called showHistory action', async () => {
    const fakeDispatch = vi.fn().mockResolvedValue({});

    const fakeGetState = vi.fn();

    const FakeStory = {
      findById: vi.fn().mockReturnValue(story()),
      getHistory: vi.fn().mockResolvedValue(history()),
      withScope: vi.fn().mockReturnValue([story()]),
      denormalizeState: vi.fn().mockReturnValue({ all: [story()] }),
    };

    fakeGetState.mockReturnValue({ stories: { all: [story()] } });

    await actions.showHistory(story().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory,
    });

    expect(fakeDispatch).toHaveBeenCalledWith(actions.loadHistory('title'));
  });

  it('Should receive a history when called showHistory action', async () => {
    const FakeStory = {
      findById: vi.fn().mockReturnValue(story()),
      getHistory: vi.fn().mockResolvedValue(history()),
      withScope: vi.fn().mockReturnValue([story()]),
      denormalizeState: vi.fn().mockReturnValue({ all: [story()] }),
    };

    const fakeDispatch = vi.fn().mockResolvedValue({});

    const fakeGetState = vi
      .fn()
      .mockReturnValue({ stories: { all: [story()] } });

    await actions.showHistory(story().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory,
    });

    expect(fakeDispatch).toHaveBeenCalledWith(
      actions.receiveHistory(history(), 'title')
    );
  });

  it('Should dispatch errorLoadHistory when called showHistory action', async () => {
    const FakeStory = {
      findById: vi.fn().mockReturnValue(story()),
      getHistory: vi.fn().mockRejectedValue('error'),
      withScope: vi.fn().mockReturnValue([story()]),
      denormalizeState: vi.fn().mockReturnValue({ all: [story()] }),
    };

    const fakeDispatch = vi.fn().mockResolvedValue({});

    const fakeGetState = vi
      .fn()
      .mockReturnValue({ stories: { all: [story()] } });

    await actions.showHistory(story().id)(fakeDispatch, fakeGetState, {
      Story: FakeStory,
    });
    expect(fakeDispatch).toHaveBeenCalledWith(actions.errorLoadHistory());
  });
});
