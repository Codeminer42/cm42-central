import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import ProjectCard from 'components/projects/ProjectCard';

const project = {};

describe('<ProjectCard />', () => {
  it('allows us to set props', () => {
    const wrapper = mount(<ProjectCard project="" />);
    expect(wrapper.props().bar).to.equal('baz');
    wrapper.setProps({ bar: 'foo' });
    expect(wrapper.props().bar).to.equal('foo');
  });

  it('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = mount(
      <ProjectCard onButtonClick={onButtonClick} />
    );
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });

  it('calls componentDidMount', () => {
    sinon.spy(ProjectCard.prototype, 'componentDidMount');
    const wrapper = mount(<ProjectCard />);
    expect(ProjectCard.prototype.componentDidMount).to.have.property('callCount', 1);
    ProjectCard.prototype.componentDidMount.restore();
  });
});
