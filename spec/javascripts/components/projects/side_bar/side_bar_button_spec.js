import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import SideBarButton from 'components/projects/SideBar/SideBarButton';

describe('<SideBarButton />', () => {
  const renderComponent = props => {
    const defaultProps = {
      children: '',
      description: '',
      onClick: vi.fn(),
      isVisible: false,
    };

    return render(<SideBarButton {...defaultProps} {...props} />);
  };

  it('renders the component', () => {
    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
  });

  it('render children', () => {
    const children = 'I am children!';
    const { getByTestId } = renderComponent({ children });

    expect(getByTestId('sidebar-button-container').innerHTML).toEqual(children);
  });

  it('does not render <SideBarButtonInfo />', () => {
    const { queryByTestId } = renderComponent();

    expect(queryByTestId('sidebar-button-info')).not.toBeInTheDocument();
  });

  describe('when click in <SideBarButton />', () => {
    it('call onClick', () => {
      const onClick = vi.fn();
      const { getByTestId } = renderComponent({ onClick });

      const button = getByTestId('sidebar-button-container');
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('when mouse over', () => {
    it('renders <SideBarButtonInfo />', async () => {
      const { getByTestId, rerender } = renderComponent();

      const button = getByTestId('sidebar-button-container');
      fireEvent.mouseOver(button);

      expect(getByTestId('sidebar-button-description')).toBeInTheDocument();
    });
  });

  describe('when isVisible is true', () => {
    it('renders <SideBar /> with SideBar__link--is-visible class', () => {
      const { getByTestId } = renderComponent({ isVisible: true });
      const button = getByTestId('sidebar-button-container');

      expect(button).toHaveClass('SideBar__link--is-visible');
    });
  });

  describe('when isVisible is false', () => {
    it('render <SideBar /> without SideBar__link--is-visible class', () => {
      const { getByTestId } = renderComponent();
      const button = getByTestId('sidebar-button-container');

      expect(button).not.toHaveClass('SideBar__link--is-visible');
    });
  });
});
