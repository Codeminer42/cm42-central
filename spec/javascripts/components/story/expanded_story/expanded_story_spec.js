import React from 'react';
import { shallow } from 'enzyme';
import { ExpandedStory } from 'components/story/ExpandedStory/index';
import storyFactory from '../../../support/factories/storyFactory';

describe('<ExpandedStory />', () => {
  it('renders children components', () => {
    const story = storyFactory();
    const project = { id: 42 };
    const wrapper = shallow(<ExpandedStory story={story} project={project} />);

    expect(wrapper.find('ExpandedStoryControls')).toExist();
    expect(wrapper.find('ExpandedStoryHistoryLocation')).toExist();
  });
});
