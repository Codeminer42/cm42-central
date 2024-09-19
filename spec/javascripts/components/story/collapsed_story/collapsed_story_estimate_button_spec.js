import { render, screen } from '@testing-library/react';
import { CollapsedStoryEstimateButton } from 'components/story/CollapsedStory/CollapsedStoryEstimateButton';
import React from 'react';

describe('<CollapsedStoryEstimateButton />', () => {
  it("renders component with 'Fibonacci' point scale", () => {
    const project = { pointValues: [1, 2, 3, 5, 8] };
    render(<CollapsedStoryEstimateButton project={project} />);

    project.pointValues.forEach(value => {
      expect(screen.getByText(value.toString())).toBeInTheDocument();
    });
  });

  it("renders component with 'Powers of two' point scale", () => {
    const project = { pointValues: [1, 2, 4, 8] };
    render(<CollapsedStoryEstimateButton project={project} />);

    project.pointValues.forEach(value => {
      expect(screen.getByText(value.toString())).toBeInTheDocument();
    });
  });

  it("renders component with 'Linear' point scale", () => {
    const project = { pointValues: [1, 2, 3, 4, 5] };
    render(<CollapsedStoryEstimateButton project={project} />);

    project.pointValues.forEach(value => {
      expect(screen.getByText(value.toString())).toBeInTheDocument();
    });
  });
});
