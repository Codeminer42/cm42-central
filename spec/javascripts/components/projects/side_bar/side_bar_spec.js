import React from 'react';
import { shallow } from 'enzyme';
import { SideBar } from 'components/projects/SideBar/index';

describe('<SideBar />', () => {
  const render = props => {
    const defaultProps = {
      reverseColumns: sinon.stub(),
      toggleColumn: sinon.stub(),
      projectBoard: {
        reverse: false,
        visibleColumns: {
          chillyBin: true,
          backlog: true,
          done: true
        }
      }
    };

    return shallow(<SideBar {...defaultProps} {...props } />);
  };

  it('renders the component', () => {
    const wrapper = render();

    expect(wrapper).toExist();
  });

  describe('when reverse button is clicked', () => {
    it('call reverseColumns', () => {
      const reverseColumns = sinon.stub();
      const wrapper = render({ reverseColumns });

      wrapper.find('[data-id="reverse-button"]').simulate('click');
      expect(reverseColumns).toHaveBeenCalled();
    });
  });
});
