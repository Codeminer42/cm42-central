import { render } from '@testing-library/react';
import { Container as CollapsedStory } from 'components/story/CollapsedStory/index';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { expect, vi } from 'vitest';
import storyFactory from '../../../support/factories/storyFactory';

const mockReducer = (state = {}, action) => state;
const createMockStore = (initialState = {}) => {
  return createStore(mockReducer, initialState);
};

describe('<CollapsedStory />', () => {
  vi.spyOn(window.md, 'makeHtml').mockReturnValue('<p>Test</p>');

  const defaultProps = () => ({
    story: {},
    onToggle: vi.fn(),
    title: '',
    className: '',
    from: 'all',
    highlight: vi.fn(),
    stories: {
      all: [],
      search: [],
    },
    provided: {
      draggableProps: {
        style: {},
      },
    },
    snapshot: {
      isDragging: false,
    },
    onLabelClick: vi.fn(),
  });

  describe("when estimate isn't null", () => {
    it('renders the component with Story--estimated className', () => {
      const story = storyFactory({ storyType: 'feature', estimate: 1 });

      const { container } = render(
        <CollapsedStory {...defaultProps()} story={story} />
      );

      expect(container.firstChild).toHaveClass('Story--estimated');
    });
  });

  describe('when estimate is null', () => {
    it('renders the component with Story--unestimated className', () => {
      const story = storyFactory({ storyType: 'feature', estimate: null });
      const mockStore = createMockStore({
        project: {
          pointValues: [1, 2, 3, 5, 8],
        },
      });

      const { container } = render(
        <Provider store={mockStore}>
          <CollapsedStory {...defaultProps()} story={story} />
        </Provider>
      );

      expect(container.firstChild).toHaveClass('Story--unestimated');
    });
  });

  describe('when storyType = release', () => {
    it('renders the component with Story--release className', () => {
      const story = storyFactory({ storyType: 'release' });

      const { container } = render(
        <CollapsedStory {...defaultProps()} story={story} />
      );

      expect(container.firstChild).toHaveClass('Story--release');
    });
  });

  it('renders children components', () => {
    const story = storyFactory({ storyType: 'feature', estimate: 1 });

    const { container } = render(
      <CollapsedStory {...defaultProps()} story={story} />
    );

    // StoryPopover
    const storyPopover = container.querySelector('.popover__content');
    expect(storyPopover).toBeInTheDocument();

    // CollapsedStoryIcon
    const collapsedStoreIcon = container.querySelector('.Story__icon');
    expect(collapsedStoreIcon).toBeInTheDocument();

    // CollapsedStoryEstimate
    const collapsedStoryEstimate = container.querySelector(
      '.Story__estimated-value'
    );
    expect(collapsedStoryEstimate).toBeInTheDocument();

    // StoryDescriptionIcon
    const storyDescriptionIcon = container.querySelector(
      '.Story__description-icon'
    );
    expect(storyDescriptionIcon).toBeInTheDocument();

    // CollapsedStoryInfo
    const collapsedStoryInfo = container.querySelector('.Story__info');
    expect(collapsedStoryInfo).toBeInTheDocument();

    // CollapsedStoryStateActions
    const collapsedStoryStateActions =
      container.querySelector('.Story__actions');
    expect(collapsedStoryStateActions).toBeInTheDocument();
  });
});
