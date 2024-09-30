import React from 'react';
import { fireEvent, render } from '@testing-library/react';
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
    const { container } = renderComponent({ children });

    expect(container.querySelector('.SideBar__link').innerHTML).toEqual(
      children
    );
  });

  it('does not render <SideBarButtonInfo />', () => {
    const { queryByTestId } = renderComponent();

    expect(queryByTestId('sidebar-button-info')).not.toBeInTheDocument();
  });

  describe('when click in <SideBarButton />', () => {
    it('call onClick', () => {
      const onClick = vi.fn();
      const { container } = renderComponent({ onClick });

      const button = container.querySelector('.SideBar__link');
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('when mouse over', () => {
    it('renders <SideBarButtonInfo />', async () => {
      const { container } = renderComponent();

      const button = container.querySelector('.SideBar__link');
      fireEvent.mouseOver(button);

      expect(container.querySelector('.SideBar__info')).toBeInTheDocument();
    });
  });

  describe('when isVisible is true', () => {
    it('renders <SideBar /> with SideBar__link--is-visible class', () => {
      const { container } = renderComponent({ isVisible: true });
      const button = container.querySelector('.SideBar__link');

      expect(button).toHaveClass('SideBar__link--is-visible');
    });
  });

  describe('when isVisible is false', () => {
    it('render <SideBar /> without SideBar__link--is-visible class', () => {
      const { container } = renderComponent();
      const button = container.querySelector('.SideBar__link');

      expect(button).not.toHaveClass('SideBar__link--is-visible');
    });
  });
});
