import ExpandedStoryRequestedBy from 'components/story/ExpandedStory/ExpandedStoryRequestedBy';
import React from 'react';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStoryRequestBy />', () => {
  const renderComponent = props => {
    const defaultProps = {
      users: [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
      ],
      story: { _editing: { requestedById: 1 } },
      onEdit: vi.fn(),
      disabled: false,
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryRequestedBy {...mergedProps} />);
  };

  it('renders properly', () => {
    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
  });
});
