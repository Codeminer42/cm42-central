import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryLabels from 'components/story/CollapsedStory/CollapsedStoryLabels';

describe('<CollapsedStoryLabels />', () => {
  it("renders <CollapsedStoryLabels /> when labels", () => {
    const labels = 'feature'
    const props = { labels: labels }

    const wrapper = shallow(<CollapsedStoryLabels {...props} />);
    expect(wrapper).toHaveClassName('Story__labels');
  });

  it("render all <StoryLabel />", () => {
    const labels = 'feature,bug'
    const props = { labels: labels }

    const wrapper = shallow(<CollapsedStoryLabels {...props} />);

    labels.split(',').forEach((label) => {
      expect(wrapper.find(`StoryLabel[label="${label}"]`)).toExist();
    })
  });
});
