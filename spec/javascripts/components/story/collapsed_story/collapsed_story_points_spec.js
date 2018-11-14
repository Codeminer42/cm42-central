import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryPoints from 'components/story/CollapsedStory/CollapsedStoryPoints';

describe('<CollapsedStoryPoints />', () => {
  it("renders <CollapsedStoryPoints /> component", () => {
    const wrapper = shallow(<CollapsedStoryPoints />);
    console.log(wrapper.debug())
    const text = wrapper.text()
    expect(text).toContain('1');
    expect(text).toContain('2');
    expect(text).toContain('3');
    expect(text).toContain('5');
    expect(text).toContain('8');
  });
});
