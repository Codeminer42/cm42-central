import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryRelase from 'components/story/ExpandedStory/ExpandedStoryRelease';
import storyFactory from '../../../../support/factories/storyFactory';

describe('<ExpandedStoryRelase />', () => {
  const defaultProps = () => ({
    story: {
      ...storyFactory(),
      _editing: storyFactory()
    },
    onEdit: sinon.spy(),
  });

  it('renders children components', () => {
    const wrapper = shallow(
      <ExpandedStoryRelase
        {...defaultProps()}
      />
    );

    expect(wrapper.find('ExpandedStoryTitle')).toExist();
    expect(wrapper.find('ExpandedStoryType')).toExist();
    expect(wrapper.find('ExpandedStoryReleaseDate')).toExist();
    expect(wrapper.find('ExpandedStoryDescription')).toExist();
  });
});
