import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryType from 'components/story/ExpandedStory/ExpandedStoryType';

describe('<ExpandedStoryEstimate />', () => {
  it("sets defaultValue as story.storyType in select", () => {
    const storyTypes = ['feature', 'bug', 'release', 'chore'];

    storyTypes.forEach((type) => {
      const story = { storyType: type };
      const wrapper = shallow(<ExpandedStoryType story={story} />);
      const select = wrapper.find('select');

      expect(select.props().defaultValue).toBe(type);
    });
  });
});
