import React from 'react';
import { render } from '@testing-library/react';
import StoryIcon from 'components/story/StoryIcon';

describe('<StoryIcon />', () => {
  const iconRules = [
    { storyType: 'feature', icon: 'start', className: 'star' },
    { storyType: 'bug', icon: 'bug_report', className: 'bug' },
    { storyType: 'chore', icon: 'settings', className: 'dark' },
    { storyType: 'release', icon: 'bookmark', className: 'bookmark' },
  ];
  iconRules.forEach(({ storyType, icon, className }) => {
    describe(`when storyType = ${storyType}`, () => {
      it('renders the story icon', () => {
        const { container } = render(<StoryIcon storyType={storyType} />);

        expect(container.querySelector('i')).toHaveClass(
          `mi md-${className} md-16`
        );
        expect(container.querySelector('.Story__icon').innerHTML).toContain(
          icon
        );
      });
    });
  });
});
