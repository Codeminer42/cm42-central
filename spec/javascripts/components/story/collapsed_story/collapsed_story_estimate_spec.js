import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryEstimate from 'components/story/CollapsedStory/CollapsedStoryEstimate';

describe('<CollapsedStoryEstimate />', () => {
  it('renders the estimate of the story', () => {
    const estimate = "1";
    const wrapper = shallow(<CollapsedStoryEstimate estimate={estimate} />);

    expect(wrapper.find('.Story__estimated-value').text()).toContain(estimate);
  });
});
