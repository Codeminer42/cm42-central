import React from 'react';
import { shallow } from 'enzyme';
import SideBarButtonInfo from 'components/projects/SideBar/SideBarButtonInfo';

describe('<SideBarButtonInfo />', () => {
  it('renders the component', () => {
    const wrapper = shallow(<SideBarButtonInfo description='' />);

    expect(wrapper).toExist();
  });

  it('contain the description', () => {
    const description = 'description';
    const wrapper = shallow(<SideBarButtonInfo description={description} />);
    const span = wrapper.find('[data-id="project-option-info"]');

    expect(span.text()).toEqual(description);
  });
});
