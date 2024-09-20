import { screen } from '@testing-library/react';
import { ExpandedStoryDefault } from 'components/story/ExpandedStory/ExpandedStoryDefault';
import React from 'react';
import { beforeAll } from 'vitest';
import { createTemporaryId } from '../../../../../../app/assets/javascripts/models/beta/story';
import storyFactory from '../../../../support/factories/storyFactory';
import { renderWithProviders } from '../../../setupRedux';

// this allows capture of elements without having to go through translations
beforeAll(() => {
  global.I18n = {
    t: vi.fn().mockImplementation(arg => arg),
  };
});

describe('<ExpandedStoryDefault />', () => {
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
    vi.mock('');

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
    const expandedStoryTitle = screen.getByText(
      'activerecord.attributes.story.title'
    );
    expect(expandedStoryTitle).toBeInTheDocument();

    // ExpandedStoryEstimate
    const expandedStoryEstimate = screen.getByText(
      'activerecord.attributes.story.estimate'
    );
    expect(expandedStoryEstimate).toBeInTheDocument();

    // ExpandedStoryType
    const expandedStoryType = screen.getByText(
      'activerecord.attributes.story.story_type'
    );
    expect(expandedStoryType).toBeInTheDocument();

    // ExpandedStoryState
    const expandedStoryState = screen.getByText(
      'activerecord.attributes.story.state'
    );
    expect(expandedStoryState).toBeInTheDocument();

    // ExpandedStoryRequestedBy
    const expandedStoryRequestedBy = screen.getByText(
      'activerecord.attributes.story.requested_by'
    );
    expect(expandedStoryRequestedBy).toBeInTheDocument();

    // ExpandedStoryOwnedBy
    const expandedStoryOwnedBy = screen.getByText(
      'activerecord.attributes.story.owned_by'
    );
    expect(expandedStoryOwnedBy).toBeInTheDocument();

    // ExpandedStoryLabels
    const expandedStoryLabels = screen.getByText(
      'activerecord.attributes.story.labels'
    );
    expect(expandedStoryLabels).toBeInTheDocument();

    // ExpandedStoryDescription
    const expandedStoryDescription = screen.getByText(
      'activerecord.attributes.story.description'
    );
    expect(expandedStoryDescription).toBeInTheDocument();

    // ExpandedStoryTask
    const expandedStoryTask = screen.getByText('story.tasks');
    expect(expandedStoryTask).toBeInTheDocument();

    // ExpandedStoryNotes
    const expandedStoryNotes = screen.getByText('add note');
    expect(expandedStoryNotes).toBeInTheDocument();
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
    const expandedStoryTitle = screen.getByText(
      'activerecord.attributes.story.title'
    );
    expect(expandedStoryTitle).toBeInTheDocument();

    // ExpandedStoryEstimate
    const expandedStoryEstimate = screen.getByText(
      'activerecord.attributes.story.estimate'
    );
    expect(expandedStoryEstimate).toBeInTheDocument();

    // ExpandedStoryType
    const expandedStoryType = screen.getByText(
      'activerecord.attributes.story.story_type'
    );
    expect(expandedStoryType).toBeInTheDocument();

    // ExpandedStoryState
    const expandedStoryState = screen.getByText(
      'activerecord.attributes.story.state'
    );
    expect(expandedStoryState).toBeInTheDocument();

    // ExpandedStoryRequestedBy
    const expandedStoryRequestedBy = screen.getByText(
      'activerecord.attributes.story.requested_by'
    );
    expect(expandedStoryRequestedBy).toBeInTheDocument();

    // ExpandedStoryOwnedBy
    const expandedStoryOwnedBy = screen.getByText(
      'activerecord.attributes.story.owned_by'
    );
    expect(expandedStoryOwnedBy).toBeInTheDocument();

    // ExpandedStoryLabels
    const expandedStoryLabels = screen.getByText(
      'activerecord.attributes.story.labels'
    );
    expect(expandedStoryLabels).toBeInTheDocument();

    // ExpandedStoryDescription
    const expandedStoryDescription = screen.getByText(
      'activerecord.attributes.story.description'
    );
    expect(expandedStoryDescription).toBeInTheDocument();

    // ExpandedStoryTask
    const expandedStoryTask = screen.queryByText('story.tasks');
    expect(expandedStoryTask).toBeNull();

    // ExpandedStoryNotes
    const expandedStoryNotes = screen.queryByText('add note');
    expect(expandedStoryNotes).toBeNull();
  });
});
