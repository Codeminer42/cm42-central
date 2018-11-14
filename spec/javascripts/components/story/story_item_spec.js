import React from 'react';
import { shallow } from 'enzyme';
import StoryItem from 'components/story/StoryItem';
import storyFactory from '../../support/factories/storyFactory'

describe('<StoryItem />', () => {
  it('renders the StoryItem component', () => {
    const story = storyFactory();
    const wrapper=shallow(<StoryItem story={story} />);

    expect(wrapper.find('CollapsedStory')).toExist();
  });
});
