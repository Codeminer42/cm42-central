import React from 'react';
import { shallow } from 'enzyme';
import SideBar from 'components/projects/SideBar';

describe('<SideBar />', () => {
  const render = props => {
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

    return shallow(<SideBar {...defaultProps} {...props} />);
  };

  it('renders the component', () => {
    const wrapper = render();

    expect(wrapper).toExist();
  });
});
