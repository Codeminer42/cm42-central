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
    isDirty: false,
    onCancel: sinon.spy(),
    onSave: sinon.spy(),
    onEdit: sinon.spy(),
    onDelete: sinon.spy(),
    canDelete: true,
    canSave: true
  });

  it('renders children components', () => {
    const wrapper = shallow(
      <ExpandedStoryRelase
        {...defaultProps()}
      />
    );

    expect(wrapper.find('ExpandedStoryControls')).toExist();
    expect(wrapper.find('ExpandedStoryTitle')).toExist();
    expect(wrapper.find('ExpandedStoryType')).toExist();
    expect(wrapper.find('ExpandedStoryReleaseDate')).toExist();
    expect(wrapper.find('ExpandedStoryDescription')).toExist();
  });
});
