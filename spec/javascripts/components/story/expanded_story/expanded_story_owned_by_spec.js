import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryOwnedBy from 'components/story/ExpandedStory/ExpandedStoryOwnedBy';

describe('<ExpandedStoryOwnedBy />', () => {
  const setup = propOverrides => {
    const defaultProps = {
      users: [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' }
      ],
      story: { _editing: { ownedById: '' } },
      onEdit: sinon.spy(),
      ...propOverrides
    };

    const wrapper = shallow(<ExpandedStoryOwnedBy {...defaultProps} />);

    return { wrapper };
  };

  it('renders properly', () => {
    const { wrapper } = setup();

    expect(wrapper).toExist();
  });
});
