import React from 'react';
import { render } from '@testing-library/react';
import Columns from 'components/Columns';

vi.mock('react-beautiful-dnd', () => ({
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe('<Columns />', () => {
  const defaultProps = {
    canClose: true,
    chillyBinStories: [],
    backlogSprints: [],
    doneSprints: [],
    fetchPastStories: vi.fn(),
    toggleColumn: vi.fn(),
    createStory: vi.fn(),
    visibleColumns: {},
    reverse: false,
  };

  it('renders the component', () => {
    const columns = render(<Columns {...defaultProps} />);

    expect(columns.container).toBeInTheDocument();
  });
});
