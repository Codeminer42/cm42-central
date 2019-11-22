import React from 'react';
import { shallow } from 'enzyme';
import EstimateBadge from 'components/story/EstimateBadge/index';
import storyFactory from '../../../support/factories/storyFactory';

describe('<EstimateBadge />', () => {
  let story;

  beforeEach(() => {
    story = storyFactory();
  });

  it('renders the component', () => {
    const wrapper = shallow(<EstimateBadge story={story} />);

    expect(wrapper).toExist();
  });

  it('renders story icon', () => {
    const wrapper = shallow(<EstimateBadge story={story} />);
    const storyIcon = wrapper.find('[data-id="story-icon"]');

    expect(storyIcon).toExist();
  });

  it('render story estimate', () => {
    const wrapper = shallow(<EstimateBadge story={story} />);
    const storyEstimate = wrapper.find('[data-id="story-estimate"]');

    expect(storyEstimate).toExist();
  });

  it('render story description icon', () => {
    const wrapper = shallow(<EstimateBadge story={story} />);
    const storyDescriptionIcon = wrapper.find('[data-id="story-description-icon"]');

    expect(storyDescriptionIcon).toExist();
  });
});

