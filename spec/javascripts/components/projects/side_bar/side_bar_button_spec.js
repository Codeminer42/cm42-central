import React from 'react';
import { shallow } from 'enzyme';
import SideBarButton from 'components/projects/SideBar/SideBarButton';

describe('<SideBarButton />', () => {
  const render = props => {
    const defaultProps = {
      children: '',
      description: '',
      onClick: sinon.stub(),
      toggled: false
    };

    return shallow(<SideBarButton {...defaultProps} {...props } />);
  };

  it('renders the component', () => {
    const wrapper = render();

    expect(wrapper).toExist();
  });

  it('render children', () => {
    const children = 'I am children!';
    const wrapper = render({ children });

    expect(wrapper.find('[data-id="side-bar-button"]').text()).toEqual(children);
  });

  it('does not render <SideBarButtonInfo />', () => {
    const wrapper = render();

    expect(wrapper.find('[data-id="button-info"]')).not.toExist();
  });

  describe('when click in <SideBarButton />', () => {
    it('call onClick', () => {
      const onClick = sinon.stub();
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

  describe('when toggled is true', () => {
    it('renders <SideBar /> with SideBar__link--is-toggled class', () => {
      const wrapper = render({ toggled: true });
      const button = wrapper.find('[data-id="side-bar-button"]');

      expect(button.hasClass('SideBar__link--is-toggled')).toBeTruthy();
    });
  });

  describe('when toggled is false', () => {
    it('render <SideBar /> without SideBar__link--is-toggled class', () => {
      const wrapper = render();
      const button = wrapper.find('[data-id="side-bar-button"]');

      expect(button.hasClass('SideBar__link--is-toggled')).toBeFalsy();
    });
  });
});
