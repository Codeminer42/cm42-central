import React from 'react';
import { render } from '@testing-library/react';
import SideBar from 'components/projects/SideBar';

describe('<SideBar />', () => {
  const renderComponent = props => {
    const defaultProps = {
      reverse: false,
      visibleColumns: {
        chillyBin: true,
        backlog: true,
        done: true,
      },
      toggleColumn: vi.fn(),
      reverseColumns: vi.fn(),
    };

    return render(<SideBar {...defaultProps} {...props} />);
  };

  it('renders the component', () => {
    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
  });
});
