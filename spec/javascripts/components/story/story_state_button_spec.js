import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
import StoryItem, {
  StateButton,
} from 'components/story/StoryItem';

beforeEach(() => {
  jasmineEnzyme();
});

describe('<StateButton />', () => {
  it("renders <StateButton /> with the right content", () => {
    const props = {
      action: 'start'
    };
    const wrapper = shallow(<StateButton {...props} />);
    expect(wrapper.text()).toEqual(I18n.translate('story.events.' + props.action));
    expect(wrapper).toHaveClassName(`Story__btn Story__btn--${props.action}`);
  });
});
