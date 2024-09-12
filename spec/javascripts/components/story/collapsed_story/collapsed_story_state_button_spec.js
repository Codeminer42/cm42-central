import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryStateButton from 'components/story/CollapsedStory/CollapsedStoryStateButton';

describe('<CollapsedStoryStateButton />', () => {
  it('renders <CollapsedStoryStateButton /> with the right content', () => {
    const props = {
      action: 'start',
      onUpdate: vi.fn(),
    };
    const wrapper = shallow(<CollapsedStoryStateButton {...props} />);
    expect(wrapper.text()).toEqual(
      I18n.translate('story.events.' + props.action)
    );
    expect(wrapper).toHaveClassName(`Story__btn Story__btn--${props.action}`);
  });

  it('calls onUpdate on click', () => {
    const action = 'start';
    const onUpdate = vi.fn();

    const wrapper = shallow(
      <CollapsedStoryStateButton action={action} onUpdate={onUpdate} />
    );

    wrapper.find('button').simulate('click');
    expect(onUpdate).toHaveBeenCalled();
  });
});
