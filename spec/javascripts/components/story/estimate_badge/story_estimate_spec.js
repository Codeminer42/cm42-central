import React from 'react';
import { shallow } from 'enzyme';
import StoryEstimate from 'components/story/EstimateBadge/StoryEstimate';

describe('<StoryEstimate />', () => {
  it('renders the estimate of the story', () => {
    const estimate = "1";
    const wrapper = shallow(<StoryEstimate estimate={estimate} />);

    expect(wrapper.find('.Story__estimated-value').text()).toContain(estimate);
  });
});
