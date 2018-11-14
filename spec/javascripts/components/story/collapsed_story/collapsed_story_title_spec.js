import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryTitle from 'components/story/CollapsedStory/CollapsedStoryTitle';

describe("<CollapsedStoryTitle />",() => {
  it("renders the title of the story",() => {
    const props = {
      title: "title",
      ownedByInitials: "FB",
      ownedByName: "Foo Bar"
    };
    const wrapper = shallow(<CollapsedStoryTitle {...props} />);

    expect(wrapper.find(`.Story__title`).text()).toContain(`${props.title}`);
  });
  it("renders the owners initials",() => {
    const props = {
      title: "title",
      ownedByInitials: "FB",
      ownedByName: "Foo Bar"
    };
    const wrapper = shallow(<CollapsedStoryTitle {...props} />);

    expect(wrapper.find(`.Story__title`).text()).toContain(`${props.ownedByInitials}`);
    expect(wrapper.find(`.Story__initials`).props().title).toEqual(`${props.ownedByName}`);
  });
});
