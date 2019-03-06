import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryRequestBy from 'components/story/ExpandedStory/ExpandedStoryRequestedBy';

describe('<ExpandedStoryRequestBy />', () => {
  const setup = propOverrides => {
    const defaultProps = () => ({
      users: [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' }
      ],
      story: { _editing: { requestedById: 1 } },
      onEdit: sinon.spy(),
      ...propOverrides
    });

    const wrapper = shallow(<ExpandedStoryRequestBy {...defaultProps()} />);

    return { wrapper };
  };

  it('renders properly', () => {
    const { wrapper } = setup();

    expect(wrapper).toExist();
  });
});
