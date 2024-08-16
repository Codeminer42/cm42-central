import React from 'react';
import { mount, shallow } from 'enzyme';

import StoryCopyIdClipboard from 'components/story/StoryCopyIdClipboard';

describe('<StoryCopyIdClipboard />', function() {
  beforeEach(function() {
    sinon.stub(I18n, 't');
  });

  afterEach(function() {
    I18n.t.restore();
  });

  it("should render story id text", function() {
    const wrapper = mount(
      <StoryCopyIdClipboard id={70} />
    );
    expect(wrapper.find('.story-id').at(0).text()).toBe('#70');
  });

  it("should render story id data-clipboard-text", function() {
    const wrapper = mount(
      <StoryCopyIdClipboard id={70} />
    );
    expect(wrapper.find('[data-clipboard-text]')).toExist();
  });

  it("should render copy id title", function() {
    shallow(
      <StoryCopyIdClipboard id={70} />
    );
    expect(I18n.t).toHaveBeenCalledWith('story.events.copy_id');
  });

});
