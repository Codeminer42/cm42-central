import { render, screen } from '@testing-library/react';
import CollapsedStoryEstimate from 'components/story/CollapsedStory/CollapsedStoryEstimate';
import React from 'react';
import { describe, expect, it } from 'vitest';

describe('<CollapsedStoryEstimate />', () => {
  it('renders the estimate of the story', () => {
    const estimate = '1';
    render(<CollapsedStoryEstimate estimate={estimate} />);

    const estimateElement = screen.getByText(estimate, {
      selector: '.Story__estimated-value',
    });
    expect(estimateElement).toBeInTheDocument();
  });
});
