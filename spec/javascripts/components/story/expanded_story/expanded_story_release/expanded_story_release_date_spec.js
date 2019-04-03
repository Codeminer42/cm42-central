import React from 'react';
import { mount } from 'enzyme';
import ExpandedStoryReleaseDate from 'components/story/ExpandedStory/ExpandedStoryRelease/ExpandedStoryReleaseDate';
import storyFactory from '../../../../support/factories/storyFactory';

describe('<ExpandedStoryReleaseDate />', () => {
  const defaultProps = () => ({
    story: {
      ...storyFactory(),
      _editing: storyFactory({ releaseDate: null })
    },
    disabled: false,
    onEdit: sinon.spy()
  });

  it('renders component title', () => {
    const wrapper = mount(
      <ExpandedStoryReleaseDate {...defaultProps()}/>
    );

    expect(wrapper.text()).toContain(I18n.t('activerecord.attributes.story.release_date'));
  });
});
