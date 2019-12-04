import React from 'react';
import { shallow } from 'enzyme';
import SideBar from 'components/projects/SideBar';

describe('<SideBar />', () => {
  const render = props => {
    const defaultProps = {
      buttons: [
        {
          description: 'description',
          onClick: sinon.stub(),
          'data-id': 'data-id',
          isVisible: false,
          icon: 'icon'
        }
      ]
    };

    return shallow(<SideBar {...defaultProps} {...props } />);
  };

  it('renders the component', () => {
    const wrapper = render();

    expect(wrapper).toExist();
  });

  describe('when have 3 buttons', () => {
    const buttons = Array(3).fill({
      description: 'description',
      onClick: sinon.stub(),
      'data-id': 'data-id',
      isVisible: false,
      icon: 'icon'
    });

    it('render 3 buttons', () => {
      const wrapper = render({ buttons });

      expect(wrapper.find('SideBarButton').length).toEqual(3);
    });
  });
});
