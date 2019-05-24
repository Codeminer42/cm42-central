import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryTooltip from 'components/story/ExpandedStory/ExpandedStoryToolTip';

describe('<ExpandedStoryTooltip />', () => {
  it('renders <Popover />', () => {
    const wrapper = shallow(<ExpandedStoryTooltip />);
    expect(wrapper.find('Popover').exists()).toBe(true);
  });
});
