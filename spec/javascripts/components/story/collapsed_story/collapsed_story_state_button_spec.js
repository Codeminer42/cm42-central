import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryStateButton from 'components/story/CollapsedStory/CollapsedStoryStateButton';

beforeEach(() => {
  jasmineEnzyme();
});

describe('<CollapsedStoryStateButton />', () => {
  it("renders <CollapsedStoryStateButton /> with the right content", () => {
    const props = {
      action: 'start'
    };
    const wrapper = shallow(<CollapsedStoryStateButton {...props} />);
    expect(wrapper.text()).toEqual(I18n.translate('story.events.' + props.action));
    expect(wrapper).toHaveClassName(`Story__btn Story__btn--${props.action}`);
  });
});
