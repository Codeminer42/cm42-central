import { render, screen } from '@testing-library/react';
import CollapsedStoryFocusButton from 'components/story/CollapsedStory/CollapsedStoryFocusButton';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { user } from '../../../support/setup';

describe('<CollapsedStoryFocusButton />', () => {
  it('renders the component', () => {
    const { container } = render(
      <CollapsedStoryFocusButton onClick={vi.fn()} />
    );

    expect(container).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', async () => {
    const spyOnClick = vi.fn();

    render(<CollapsedStoryFocusButton onClick={spyOnClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(spyOnClick).toHaveBeenCalledOnce();
  });
});
