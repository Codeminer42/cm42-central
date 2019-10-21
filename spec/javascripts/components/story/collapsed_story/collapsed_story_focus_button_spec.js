import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryFocusButton from 'components/story/CollapsedStory/CollapsedStoryFocusButton';

describe('<CollapsedStoryFocusButton />', () => {
  it('renders the component', () => {
    const wrapper = shallow(
      <CollapsedStoryFocusButton 
        onClick={sinon.stub()}
      />
    );

    expect(wrapper).toExist();
  });

  it('call onClick when button was clicked', () => {
    const spyOnClick = sinon.spy();

    const wrapper = shallow(
      <CollapsedStoryFocusButton
        onClick={spyOnClick}
      />
    )

    const button = wrapper.find('[data-id="focus-button"]');

    button.simulate('click', {
      stopPropagation: () => sinon.stub()
    });

    expect(spyOnClick.called).toBeTruthy();
  });
});
