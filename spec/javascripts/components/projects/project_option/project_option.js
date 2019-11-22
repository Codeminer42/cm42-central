import React from 'react';
import { shallow } from 'enzyme';
import ProjectOption from 'components/projects/ProjectOption/index';

describe('<ProjectOption />', () => {
  const render = props => {
    const defaultProps = {
      children: '',
      description: '',
      onClick: sinon.stub()
    };

    return shallow(<ProjectOption {...defaultProps} {...props } />);
  };

  it('renders the component', () => {
    const wrapper = render();

    expect(wrapper).toExist();
  });

  it('render children', () => {
    const children = 'I am children!';
    const wrapper = render({ children });

    expect(wrapper.find('[data-id="project-option"]').text()).toEqual(children);
  });

  it('does not render <ProjectOptionInfo />', () => {
    const wrapper = render();

    expect(wrapper.find('ProjectOptionInfo')).not.toExist();
  });

  describe('when click in <ProjectOption />', () => {
    it('call onClick', () => {
      const onClick = sinon.stub();
      const wrapper = render({ onClick });

      wrapper.find('[data-id="project-option"]').simulate('click');
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('when mouse over', () => {
    it('renders <ProjectOptionInfo />', () => {
      const wrapper = render();

      wrapper.find('[data-id="project-option"]').simulate('hover');
      expect(wrapper.find('ProjectOptionInfo')).toExist();
    });
  });
});
