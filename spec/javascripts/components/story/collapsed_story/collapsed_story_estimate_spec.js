import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryEstimate from 'components/story/CollapsedStory/CollapsedStoryEstimate';

describe('<CollapsedStoryEstimate />', () => {
  it('renders the estimate of the story', () => {
    const props = {
      estimate: 1
    };
    const wrapper = shallow(<CollapsedStoryEstimate {...props} />);

    expect(wrapper.find('.Story__estimated').text()).toContain(props.estimate);
  });
});
