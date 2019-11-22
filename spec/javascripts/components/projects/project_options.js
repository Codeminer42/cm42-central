import React from 'react';
import { shallow } from 'enzyme';
import { ProjectOptions } from 'components/projects/ProjectOptions';

describe('<ProjectOptions />', () => {
  const render = props => {
    const defaultProps = {
      reverseColumns: sinon.stub()
    };

    return shallow(<ProjectOptions {...defaultProps} {...props } />);
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
