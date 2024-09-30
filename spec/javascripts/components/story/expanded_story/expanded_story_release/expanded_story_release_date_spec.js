import { screen } from '@testing-library/react';
import ExpandedStoryReleaseDate from 'components/story/ExpandedStory/ExpandedStoryRelease/ExpandedStoryReleaseDate';
import React from 'react';
import storyFactory from '../../../../support/factories/storyFactory';
import { renderWithProviders } from '../../../setupRedux';

describe('<ExpandedStoryReleaseDate />', () => {
  const renderComponent = props => {
    const defaultProps = {
      story: {
        ...storyFactory(),
        _editing: storyFactory({ releaseDate: null }),
      },
      disabled: false,
      onEdit: vi.fn(),
    };
    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryReleaseDate {...mergedProps} />);
  };

  it('renders component title', () => {
    renderComponent();

    const releaseText = screen.getByText(
      I18n.t('activerecord.attributes.story.release_date')
    );
    expect(releaseText).toBeInTheDocument();
  });
});
