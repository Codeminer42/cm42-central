import ExpandedStoryOwnedBy from 'components/story/ExpandedStory/ExpandedStoryOwnedBy';
import React from 'react';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStoryOwnedBy />', () => {
  const renderComponent = props => {
    const defaultProps = {
      users: [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
      ],
      story: { _editing: { ownedById: '' } },
      onEdit: vi.fn(),
      disabled: false,
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryOwnedBy {...mergedProps} />);
  };

  it('renders properly', () => {
    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
  });
});
