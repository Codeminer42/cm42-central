import { fireEvent, render, screen } from '@testing-library/react';
import CollapsedStoryFocusButton from 'components/story/CollapsedStory/CollapsedStoryFocusButton';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('<CollapsedStoryFocusButton />', () => {
  it('renders the component', () => {
    const { container } = render(
      <CollapsedStoryFocusButton onClick={vi.fn()} />
    );

    expect(container).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const spyOnClick = vi.fn();

    render(<CollapsedStoryFocusButton onClick={spyOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(spyOnClick).toHaveBeenCalledOnce();
  });
});
