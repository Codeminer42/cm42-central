import { fireEvent } from '@testing-library/react';
import ExpandedStoryHistoryLocation from 'components/story/ExpandedStory/ExpandedStoryHistoryLocation';
import { storyTypes } from 'libs/beta/constants';
import React from 'react';
import storyFactory from '../../../support/factories/storyFactory';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStoryHistoryLocation />', () => {
  vi.spyOn(window.md, 'makeHtml').mockReturnValue('<p>Test</p>');
  vi.mock('react-clipboard.js', () => ({
    default: vi
      .fn()
      .mockImplementation(({ children, ...props }) => (
        <div {...props}>{children}</div>
      )),
  }));

  const renderComponent = props => {
    const defaultProps = {
      onClone: vi.fn(),
      showHistory: vi.fn(),
      story: {
        ...storyFactory(),
        _editing: storyFactory(),
      },
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(
      <ExpandedStoryHistoryLocation {...mergedProps} />
    );
  };

  describe('when user click on clone story', () => {
    it('calls onClone callback', () => {
      const onClone = vi.fn();

      const { container } = renderComponent({ onClone });
      const cloneButton = container.querySelector('.clone-story');
      fireEvent.click(cloneButton);

      expect(onClone).toHaveBeenCalled();
    });
  });

  describe('story link', () => {
    it('renders an input with the right story link', () => {
      const props = {
        story: storyFactory({
          id: 42,
          _editing: storyFactory(),
        }),
      };

      const { container } = renderComponent(props);
      const storyInput = container.querySelector('input');

      expect(storyInput.value).toMatch(/#story-42$/);
    });
  });

  describe('copy id to clipboard', () => {
    it('renders a clipboard component with the right story id', () => {
      const props = {
        story: storyFactory({ id: 42, _editing: storyFactory() }),
      };

      const { container } = renderComponent(props);
      const copyIdButton = container.querySelector(
        `[data-clipboard-text="#42"]`
      );

      expect(copyIdButton).toBeInTheDocument();
    });
  });

  describe('when story is release', () => {
    it('doest not render history button', () => {
      const props = {
        story: storyFactory({
          storyType: storyTypes.RELEASE,
          _editing: storyFactory(),
        }),
      };

      const { container } = renderComponent(props);
      const historyButton = container.querySelector(
        '[data-id="history-button"]'
      );

      expect(historyButton).toBeNull();
    });
  });

  const noReleasesTypes = [
    storyTypes.FEATURE,
    storyTypes.BUG,
    storyTypes.CHORE,
  ];

  noReleasesTypes.forEach(storyType => {
    describe(`when story is ${storyType}`, () => {
      it('renders history button', () => {
        const props = {
          story: storyFactory({ storyType, _editing: storyFactory() }),
        };

        const { container } = renderComponent(props);
        const historyButton = container.querySelector(
          '[data-id="history-button"]'
        );

        expect(historyButton).toBeInTheDocument();
      });
    });
  });
});
