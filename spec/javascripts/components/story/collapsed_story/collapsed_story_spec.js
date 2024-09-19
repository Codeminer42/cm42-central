import { render, screen } from '@testing-library/react';
import { Container as CollapsedStory } from 'components/story/CollapsedStory/index';
import React from 'react';
import storyFactory from '../../../support/factories/storyFactory';

/**
 * needed because testing library's render method
 * returns something html-react-parser doesn't understand
 * and it breaks the test after the component is rendered
 */
vi.mock('html-react-parser', () => ({
  default: vi.fn(),
}));

/**
 * only direct children are mocked and tested for rendering
 */
vi.mock('components/story/StoryPopover', () => ({
  default: () => <div data-testid="story-popover" />,
}));
vi.mock('components/story/CollapsedStory/CollapsedStoryInfo', () => ({
  default: () => <div data-testid="collapsed-story-info" />,
}));
vi.mock('components/story/CollapsedStory/CollapsedStoryStateActions', () => ({
  default: () => <div data-testid="collapsed-story-state-actions" />,
}));

describe('<CollapsedStory />', () => {
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

      const { container } = render(
        <CollapsedStory {...defaultProps()} story={story} />
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
    const components = [
      'story-popover',
      'collapsed-story-info',
      'collapsed-story-state-actions',
    ];

    render(<CollapsedStory {...defaultProps()} story={story} />);

    for (const testId of components) {
      const child = screen.getByTestId(testId);

      expect(child).toBeInTheDocument();
    }
  });
});
