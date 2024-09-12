import React from 'react';
import { shallow } from 'enzyme';
import SideBarButton from 'components/projects/SideBar/SideBarButton';

describe('<SideBarButton />', () => {
  const render = props => {
    const defaultProps = {
      children: '',
      description: '',
      onClick: vi.fn(),
      isVisible: false,
    };

    return shallow(<SideBarButton {...defaultProps} {...props} />);
  };

  it('renders the component', () => {
    const wrapper = render();

    expect(wrapper).toExist();
  });

  it('render children', () => {
    const children = 'I am children!';
    const wrapper = render({ children });

    expect(wrapper.find('[data-id="side-bar-button"]').text()).toEqual(
      children
    );
  });

  it('does not render <SideBarButtonInfo />', () => {
    const wrapper = render();

    expect(wrapper.find('[data-id="button-info"]')).not.toExist();
  });

  describe('when click in <SideBarButton />', () => {
    it('call onClick', () => {
      const onClick = vi.fn();
      const wrapper = render({ onClick });

      wrapper.find('[data-id="side-bar-button"]').simulate('click');
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('when mouse over', () => {
    it('renders <SideBarButtonInfo />', () => {
      const wrapper = render();

      wrapper.find('[data-id="side-bar-button"]').simulate('mouseover');
      expect(wrapper.find('[data-id="button-info"]')).toExist();
    });
  });

  describe('when isVisible is true', () => {
    it('renders <SideBar /> with SideBar__link--is-visible class', () => {
      const wrapper = render({ isVisible: true });
      const button = wrapper.find('[data-id="side-bar-button"]');

      expect(button.hasClass('SideBar__link--is-visible')).toBeTruthy();
    });
  });

  describe('when isVisible is false', () => {
    it('render <SideBar /> without SideBar__link--is-visible class', () => {
      const wrapper = render();
      const button = wrapper.find('[data-id="side-bar-button"]');

      expect(button.hasClass('SideBar__link--is-visible')).toBeFalsy();
    });
  });
});
