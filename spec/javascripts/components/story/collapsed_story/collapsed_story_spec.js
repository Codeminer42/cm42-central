import { Container as CollapsedStory } from 'components/story/CollapsedStory/index';
import React from 'react';
import { expect, vi } from 'vitest';
import storyFactory from '../../../support/factories/storyFactory';
import { renderWithProviders } from '../../setupRedux';

describe('<CollapsedStory />', () => {
  vi.spyOn(window.md, 'makeHtml').mockReturnValue('<p>Test</p>');

  const renderComponent = props => {
    const defaultProps = {
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
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<CollapsedStory {...mergedProps} />, {
      preloadedState: {
        project: {
          pointValues: [],
        },
      },
    });
  };

  describe("when estimate isn't null", () => {
    it('renders the component with Story--estimated className', () => {
      const props = {
        story: storyFactory({ storyType: 'feature', estimate: 1 }),
      };

      const { container } = renderComponent(props);

      expect(container.firstChild).toHaveClass('Story--estimated');
    });
  });

  describe('when estimate is null', () => {
    it('renders the component with Story--unestimated className', () => {
      const props = {
        story: storyFactory({ storyType: 'feature', estimate: null }),
      };

      const { container } = renderComponent(props);

      expect(container.firstChild).toHaveClass('Story--unestimated');
    });
  });

  describe('when storyType = release', () => {
    it('renders the component with Story--release className', () => {
      const props = {
        story: storyFactory({ storyType: 'release' }),
      };

      const { container } = renderComponent(props);

      expect(container.firstChild).toHaveClass('Story--release');
    });
  });

  it('renders children components', () => {
    const props = {
      story: storyFactory({ storyType: 'feature', estimate: 1 }),
    };

    const { container } = renderComponent(props);

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
