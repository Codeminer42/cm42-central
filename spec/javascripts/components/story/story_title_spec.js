import React from 'react';
import { shallow } from 'enzyme';
import StoryItem, {
  StoryTitle
} from 'components/story/StoryItem';

describe("<StoryTitle />",() => {
  it("renders the title of the story",() => {
    const props = {
      title: "title",
      ownedByInitials: "FB",
      ownedByName: "Foo Bar"
    };
    const wrapper = shallow(<StoryTitle {...props} />);

    expect(wrapper.find(`.Story__title`).text()).toContain(`${props.title}`);
  });
  it("renders the owners initials",() => {
    const props = {
      title: "title",
      ownedByInitials: "FB",
      ownedByName: "Foo Bar"
    };
    const wrapper = shallow(<StoryTitle {...props} />);

    expect(wrapper.find(`.Story__title`).text()).toContain(`${props.ownedByInitials}`);
    expect(wrapper.find(`.Story__initials`).props().title).toEqual(`${props.ownedByName}`);
  });
});
