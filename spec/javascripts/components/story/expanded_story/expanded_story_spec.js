import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStory from 'components/story/ExpandedStory/index';
import storyFactory from '../../../support/factories/storyFactory';

describe('<ExpandedStory />', () => {
  it('renders children components', () => {
    const props = storyFactory();
    const wrapper = shallow(<ExpandedStory story={props} />);

    expect(wrapper.find('ExpandedStoryControls')).toExist();
    expect(wrapper.find('ExpandedStoryHistoryLocation')).toExist();
  });
});
