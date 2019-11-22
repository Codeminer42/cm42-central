import React from 'react';
import { shallow } from 'enzyme';
import { ProjectOptions } from 'components/projects/ProjectOptions';

describe('<ProjectOptions />', () => {
  const render = props => {
    const defaultProps = {
      reverseColumnsProjectBoard: sinon.stub()
    };

    return shallow(<ProjectOptions {...defaultProps} {...props } />);
  };

  it('renders the component', () => {
    const wrapper = render();

    expect(wrapper).toExist();
  });

  describe('when reverse button is clicked', () => {
    it('call reverseColumnsProjectBoard', () => {
      const reverseColumnsProjectBoard = sinon.stub();
      const wrapper = render({ reverseColumnsProjectBoard });

      wrapper.find('[data-id="reverse-button"]').simulate('click');
      expect(reverseColumnsProjectBoard).toHaveBeenCalled();
    });
  });
});
