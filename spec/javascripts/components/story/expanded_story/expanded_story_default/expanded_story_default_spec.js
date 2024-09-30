import { ExpandedStoryDefault } from 'components/story/ExpandedStory/ExpandedStoryDefault';
import React from 'react';
import { createTemporaryId } from '../../../../../../app/assets/javascripts/models/beta/story';
import storyFactory from '../../../../support/factories/storyFactory';
import { renderWithProviders } from '../../../setupRedux';

describe('<ExpandedStoryDefault />', () => {
  beforeEach(function () {
    vi.spyOn(I18n, 't');
  });

  afterEach(function () {
    I18n.t.mockRestore();
  });

  vi.spyOn(window.md, 'makeHtml').mockReturnValue('<p>Test</p>');
  vi.mock('react-clipboard.js', () => ({
    default: vi
      .fn()
      .mockImplementation(({ children }) => <div>{children}</div>),
  }));

  const renderComponent = props => {
    const defaultProps = {
      story: {
        ...storyFactory(),
        _editing: storyFactory(),
      },
      onEdit: vi.fn(),
      storyFailure: vi.fn(),
      createTask: vi.fn(),
      deleteTask: vi.fn(),
      toggleTask: vi.fn(),
      deleteNote: vi.fn(),
      createNote: vi.fn(),
      addLabel: vi.fn(),
      removeLabel: vi.fn(),
      setLoadingStory: vi.fn(),
      users: [],
      project: { pointValues: [], labels: [] },
      enabled: true,
      onClone: vi.fn(),
      showHistory: vi.fn(),
      disabled: false,
    };
    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryDefault {...mergedProps} />);
  };

  it("renders all children components when story isn't new", () => {
    const props = {
      story: {
        ...storyFactory({ id: 42 }),
        _editing: storyFactory({ id: 42 }),
      },
    };

    const { container } = renderComponent(props);

    // ExpandedStoryHistoryLocation
    const expandedStoryHistoryLocation =
      container.querySelector('#story-link-42');
    expect(expandedStoryHistoryLocation).toBeInTheDocument();

    // ExpandedStoryTitle
    expect(I18n.t).toHaveBeenCalledWith('activerecord.attributes.story.title');

    // ExpandedStoryEstimate

    expect(I18n.t).toHaveBeenCalledWith(
      'activerecord.attributes.story.estimate'
    );

    // ExpandedStoryType
    expect(I18n.t).toHaveBeenCalledWith(
      'activerecord.attributes.story.story_type'
    );

    // ExpandedStoryState
    expect(I18n.t).toHaveBeenCalledWith('activerecord.attributes.story.state');

    // ExpandedStoryRequestedBy
    expect(I18n.t).toHaveBeenCalledWith(
      'activerecord.attributes.story.requested_by'
    );

    // ExpandedStoryOwnedBy
    expect(I18n.t).toHaveBeenCalledWith(
      'activerecord.attributes.story.owned_by'
    );

    // ExpandedStoryLabels
    expect(I18n.t).toHaveBeenCalledWith('activerecord.attributes.story.labels');

    // ExpandedStoryDescription
    expect(I18n.t).toHaveBeenCalledWith(
      'activerecord.attributes.story.description'
    );

    // ExpandedStoryTask
    expect(I18n.t).toHaveBeenCalledWith('story.tasks');

    // ExpandedStoryNotes
    expect(I18n.t).toHaveBeenCalledWith('add note');
  });

  it('does not render some components when it is a new story', () => {
    const id = createTemporaryId();
    const props = {
      story: {
        ...storyFactory({ id }),
        _editing: storyFactory({ id }),
      },
    };

    const { container } = renderComponent(props);

    // ExpandedStoryHistoryLocation
    const expandedStoryHistoryLocation =
      container.querySelector('#story-link-42');
    expect(expandedStoryHistoryLocation).toBeNull();

    // ExpandedStoryTitle
    expect(I18n.t).toHaveBeenCalledWith('activerecord.attributes.story.title');

    // ExpandedStoryEstimate

    expect(I18n.t).toHaveBeenCalledWith(
      'activerecord.attributes.story.estimate'
    );

    // ExpandedStoryType
    expect(I18n.t).toHaveBeenCalledWith(
      'activerecord.attributes.story.story_type'
    );

    // ExpandedStoryState
    expect(I18n.t).toHaveBeenCalledWith('activerecord.attributes.story.state');

    // ExpandedStoryRequestedBy
    expect(I18n.t).toHaveBeenCalledWith(
      'activerecord.attributes.story.requested_by'
    );

    // ExpandedStoryOwnedBy
    expect(I18n.t).toHaveBeenCalledWith(
      'activerecord.attributes.story.owned_by'
    );

    // ExpandedStoryLabels
    expect(I18n.t).toHaveBeenCalledWith('activerecord.attributes.story.labels');

    // ExpandedStoryDescription
    expect(I18n.t).toHaveBeenCalledWith(
      'activerecord.attributes.story.description'
    );

    // ExpandedStoryTask
    expect(I18n.t).not.toHaveBeenCalledWith('story.tasks');

    // ExpandedStoryNotes
    expect(I18n.t).not.toHaveBeenCalledWith('add note');
  });
});
