import { render, screen } from '@testing-library/react';
import CollapsedStoryTitle from 'components/story/CollapsedStory/CollapsedStoryTitle';
import React from 'react';
import { describe, expect, it } from 'vitest';
import storyFactory from '../../../support/factories/storyFactory';

describe('<CollapsedStoryTitle />', () => {
  it('renders the title of the story', () => {
    const props = storyFactory();

    render(<CollapsedStoryTitle story={props} />);

    const titleElement = screen.getByText(props.title);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('Story__title');
  });
  it('renders the owners initials', () => {
    const props = storyFactory();

    render(<CollapsedStoryTitle story={props} />);

    const initialsElement = screen.getByText(props.ownedByInitials);
    expect(initialsElement).toBeInTheDocument();
    expect(initialsElement).toHaveClass('Story__initials');
    expect(initialsElement).toHaveAttribute('title', props.ownedByName);
  });
});
