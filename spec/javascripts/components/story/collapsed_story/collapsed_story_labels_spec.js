import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryLabels from 'components/story/CollapsedStory/CollapsedStoryLabels';
import storyFactory from '../../../support/factories/storyFactory';

describe('<CollapsedStoryLabels />', () => {
  it('renders <CollapsedStoryLabels /> when labels', () => {
    const labels = [
      { id: 0, name: 'front' },
      { id: 1, name: 'back' }
    ];

    const story = storyFactory({ labels });

    const wrapper = shallow(<CollapsedStoryLabels story={story} onLabelClick={sinon.stub()} />);
    expect(wrapper).toHaveClassName('Story__labels');
  });

  it('render all <StoryLabel />', () => {
    const labels = [
      { id: 0, name: 'front' },
      { id: 1, name: 'back' }
    ];

    const story = storyFactory({ labels });

    const wrapper = shallow(<CollapsedStoryLabels story={story} onLabelClick={sinon.stub()} />);

    labels.forEach((label) => {
      expect(wrapper.find(`StoryLabel[label="${label.name}"]`)).toExist();
    })
  });
});
