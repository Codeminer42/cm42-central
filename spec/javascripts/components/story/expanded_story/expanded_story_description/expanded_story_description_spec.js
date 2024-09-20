import ExpandedStoryDescription from 'components/story/ExpandedStory/ExpandedStoryDescription/index';
import React from 'react';
import { renderWithProviders } from '../../../setupRedux';

describe('<ExpandedStoryDescription />', () => {
  const renderComponent = props => {
    const defaultProps = {
      story: {},
      onEdit: vi.fn(),
      disabled: false,
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryDescription {...mergedProps} />);
  };

  it('renders component', () => {
    const props = { story: { description: '', _editing: { description: '' } } };

    const { container } = renderComponent(props);

    expect(container).toBeInTheDocument();
  });
});
