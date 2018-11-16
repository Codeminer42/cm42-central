import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryLabels from 'components/story/CollapsedStory/CollapsedStoryLabels';
import storyFactory from '../../../support/factories/storyFactory';

describe('<CollapsedStoryLabels />', () => {
  it("renders <CollapsedStoryLabels /> when labels", () => {
    const labels = 'feature'
    const props = storyFactory({labels: labels});

    const wrapper = shallow(<CollapsedStoryLabels story={props} />);
    expect(wrapper).toHaveClassName('Story__labels');
  });

  it("render all <StoryLabel />", () => {
    const labels = 'feature,bug'
    const props = storyFactory({labels: labels});

    const wrapper = shallow(<CollapsedStoryLabels story={props} />);

    labels.split(',').forEach((label) => {
      expect(wrapper.find(`StoryLabel[label="${label}"]`)).toExist();
    })
  });
});
