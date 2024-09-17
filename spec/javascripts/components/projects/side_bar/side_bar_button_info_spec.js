import React from 'react';
import { render } from '@testing-library/react';
import SideBarButtonInfo from 'components/projects/SideBar/SideBarButtonInfo';

describe('<SideBarButtonInfo />', () => {
  it('renders the component', () => {
    const { container } = render(<SideBarButtonInfo description="" />);

    expect(container).toBeInTheDocument();
  });

  it('contain the description', () => {
    const description = 'description';
    const { getByTestId } = render(
      <SideBarButtonInfo description={description} />
    );
    const span = getByTestId('sidebar-button-description');

    expect(span.innerHTML).toEqual(description);
  });
});
