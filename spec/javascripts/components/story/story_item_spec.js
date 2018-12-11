import React from 'react';
import { shallow } from 'enzyme';
import { StoryItem } from 'components/story/StoryItem';
import storyFactory from '../../support/factories/storyFactory';
import ExpandedStory from 'components/story/ExpandedStory';
import CollapsedStory from 'components/story/CollapsedStory';


describe('<StoryItem />', () => {
  it('renders the StoryItem component within a Collapsed Story', () => {
    const story = storyFactory({ collapsed: true });
    const wrapper = shallow(<StoryItem story={story} />);

    expect(wrapper.find(CollapsedStory)).toExist();
  });

  it('renders the StoryItem component within a Expanded Story', () => {
    const story = storyFactory({ collapsed: false });
    const wrapper = shallow(<StoryItem story={story} />);

    expect(wrapper.find(ExpandedStory)).toExist();
  });
});
