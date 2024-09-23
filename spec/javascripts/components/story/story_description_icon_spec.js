import React from 'react';
import { render } from '@testing-library/react';
import StoryDescriptionIcon from 'components/story/StoryDescriptionIcon';
import storyFactory from '../../support/factories/storyFactory';

describe('<StoryDescriptionIcon />', () => {
  describe('When description is null', () => {
    it('renders nothing', () => {
      const props = storyFactory({ description: null });
      const { container } = render(<StoryDescriptionIcon {...props} />);
      expect(container.querySelector('.Story__description-icon')).toBeNull();
    });
  });

  describe('When description exists', () => {
    it('renders the description icon', () => {
      const props = storyFactory();
      const { container } = render(<StoryDescriptionIcon {...props} />);
      expect(container.firstChild).toHaveClass('Story__description-icon');
    });
  });
});
