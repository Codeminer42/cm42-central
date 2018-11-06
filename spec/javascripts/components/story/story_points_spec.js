import React from 'react';
import { shallow } from 'enzyme';
import StoryItem, {
  StoryPoints,
} from 'components/story/StoryItem';

describe('<StoryPoints />', () => {
  it("renders <StoryPoints /> component", () => {
    const wrapper = shallow(<StoryPoints />);
    const text = wrapper.text()
    expect(text).toContain('1');
    expect(text).toContain('2');
    expect(text).toContain('3');
    expect(text).toContain('5');
    expect(text).toContain('8');
  });
});
