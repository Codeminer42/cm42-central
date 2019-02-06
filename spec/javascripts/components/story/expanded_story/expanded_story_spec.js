import React from 'react';
import { shallow } from 'enzyme';
import { ExpandedStory } from 'components/story/ExpandedStory/index';
import storyFactory from '../../../support/factories/storyFactory';

describe('<ExpandedStory />', () => {
  it('renders children components', () => {
    const story = storyFactory({_editing: storyFactory()});
    const project = { id: 42 };
    const wrapper = shallow(<ExpandedStory story={story} project={project} />);

    expect(wrapper.find('ExpandedStoryControls')).toExist();
    expect(wrapper.find('ExpandedStoryHistoryLocation')).toExist();
  });

  it('adds loading overlay when updating a story', () => {
    const story = storyFactory({_editing: storyFactory({loading: true})});
    const project = { id: 42 };
    const wrapper = shallow(<ExpandedStory story={story} project={project} />);

    expect(wrapper.find('div.Story__enable-loading')).toExist();
  })
});
