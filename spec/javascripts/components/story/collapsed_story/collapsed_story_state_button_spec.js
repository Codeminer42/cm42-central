import { fireEvent, render, screen } from '@testing-library/react';
import CollapsedStoryStateButton from 'components/story/CollapsedStory/CollapsedStoryStateButton';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('I18n', () => ({
  translate: key => key,
}));

describe('<CollapsedStoryStateButton />', () => {
  it('renders <CollapsedStoryStateButton /> with the right content', () => {
    const props = {
      action: 'start',
      onUpdate: vi.fn(),
    };

    render(<CollapsedStoryStateButton {...props} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('story.events.start');
    expect(button).toHaveClass('Story__btn', 'Story__btn--start');
  });

  it('calls onUpdate on click', () => {
    const action = 'start';
    const onUpdate = vi.fn();

    render(<CollapsedStoryStateButton action={action} onUpdate={onUpdate} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onUpdate).toHaveBeenCalledTimes(1);
  });
});
