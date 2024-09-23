import { screen } from '@testing-library/react';
import { ExpandedStory } from 'components/story/ExpandedStory/index';
import React from 'react';
import storyFactory from '../../../support/factories/storyFactory';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStory />', () => {
  vi.spyOn(window.md, 'makeHtml').mockReturnValue('<p>Test</p>');
  vi.mock('react-clipboard.js', () => ({
    default: vi
      .fn()
      .mockImplementation(({ children }) => <div>{children}</div>),
  }));

  const renderComponent = props => {
    const defaultProps = {
      story: storyFactory(),
      editStory: vi.fn(),
      saveStory: vi.fn(),
      deleteStory: vi.fn(),
      project: { labels: [], pointValues: [] },
      disabled: false,
      onToggle: vi.fn(),
      cloneStory: vi.fn(),
      showHistory: vi.fn(),
      onLabelClick: vi.fn(),
      onClone: vi.fn(),
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStory {...mergedProps} />);
  };

  describe('when storyType is a release', () => {
    it('renders ExpandedStoryRelease component', () => {
      const props = {
        story: storyFactory({
          _editing: {
            ...storyFactory(),
            storyType: 'release',
          },
        }),
      };

      renderComponent(props);
      const releaseTitle = screen.getByText(
        I18n.t('activerecord.attributes.story.release_date')
      );

      expect(releaseTitle).toBeInTheDocument();
    });
  });

  describe("when storyType isn't a release", () => {
    it('renders ExpandedStoryDefault component', () => {
      const props = {
        story: storyFactory({
          _editing: {
            ...storyFactory(),
            storyType: 'feature',
            title: 'this title appears everywhere',
          },
        }),
      };

      renderComponent(props);
      const expandedStoryDefault = screen.getByDisplayValue(
        'this title appears everywhere'
      );
      const releaseTitle = screen.queryByText(
        I18n.t('activerecord.attributes.story.release_date')
      );

      expect(expandedStoryDefault).toBeInTheDocument();
      expect(releaseTitle).toBeNull();
    });
  });

  describe('when story is editable', () => {
    const props = {
      story: storyFactory({
        _editing: {
          ...storyFactory(),
          storyType: 'feature',
          state: 'unstarted',
          title: 'this title appears everywhere',
        },
      }),
    };

    it('passes disabled prop as false', () => {
      renderComponent(props);
      const expandedStoryDefault = screen.getByDisplayValue(
        'this title appears everywhere'
      );

      expect(expandedStoryDefault).not.toHaveAttribute('readonly');
    });
  });

  describe('when story is not editable', () => {
    const props = {
      story: storyFactory({
        _editing: {
          ...storyFactory(),
          storyType: 'feature',
          state: 'accepted',
          title: 'this title appears everywhere',
        },
        storyType: 'feature',
        state: 'accepted',
      }),
    };

    it('passes disabled prop as true', () => {
      renderComponent(props);
      const expandedStoryDefault = screen.getByDisplayValue(
        'this title appears everywhere'
      );

      expect(expandedStoryDefault).toHaveAttribute('readonly');
    });
  });

  it('adds enable-loading className when updating a story', () => {
    const props = {
      story: storyFactory({
        _editing: {
          ...storyFactory({ loading: true }),
        },
      }),
    };

    const { container } = renderComponent(props);
    const storyLoading = container.querySelector('.Story__enable-loading');

    expect(storyLoading).toBeInTheDocument();
  });
});
