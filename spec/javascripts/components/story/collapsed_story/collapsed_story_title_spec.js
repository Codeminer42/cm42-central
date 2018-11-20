import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryTitle from 'components/story/CollapsedStory/CollapsedStoryTitle';
import storyFactory from '../../../support/factories/storyFactory';

describe("<CollapsedStoryTitle />",() => {
  it("renders the title of the story",() => {
    const props = storyFactory();
    const wrapper = shallow(<CollapsedStoryTitle story={props} />);

    expect(wrapper.find(`.Story__title`).text()).toContain(`${props.title}`);
  });
  it("renders the owners initials",() => {
    const props = storyFactory();
    const wrapper = shallow(<CollapsedStoryTitle story={props} />);

    expect(wrapper.find(`.Story__title`).text()).toContain(`${props.ownedByInitials}`);
    expect(wrapper.find(`.Story__initials`).props().title).toEqual(`${props.ownedByName}`);
  });
});
