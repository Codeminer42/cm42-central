import { render, screen } from '@testing-library/react';
import CollapsedStoryLabels from 'components/story/CollapsedStory/CollapsedStoryLabels';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import storyFactory from '../../../support/factories/storyFactory';

describe('<CollapsedStoryLabels />', () => {
  it('renders <CollapsedStoryLabels /> when labels', () => {
    const labels = [
      { id: 0, name: 'front' },
      { id: 1, name: 'back' },
    ];

    const story = storyFactory({ labels });
    const { container } = render(
      <CollapsedStoryLabels story={story} onLabelClick={vi.fn()} />
    );

    expect(container.firstChild).toHaveClass('Story__labels');
  });

  it('render all <StoryLabel />', () => {
    const labels = [
      { id: 0, name: 'front' },
      { id: 1, name: 'back' },
    ];

    const story = storyFactory({ labels });

    render(<CollapsedStoryLabels story={story} onLabelClick={vi.fn()} />);

    labels.forEach(label => {
      expect(screen.getByText(label.name)).toBeInTheDocument();
    });
  });
});
