import React from 'react';
import { shallow } from 'enzyme';
import { ExpandedStoryDefault } from 'components/story/ExpandedStory/ExpandedStoryDefault';
import storyFactory from '../../../../support/factories/storyFactory';

describe('<ExpandedStoryDefault />', () => {
  const defaultProps = () => ({
    story: {
      ...storyFactory(),
      _editing: storyFactory()
    },
    onEdit: sinon.spy(),
    storyFailure: sinon.spy(),
    createTask: sinon.spy(),
    deleteTask: sinon.spy(),
    toggleTask: sinon.spy(),
    deleteNote: sinon.spy(),
    createNote: sinon.spy(),
    addLabel: sinon.spy(),
    removeLabel: sinon.spy(),
    setLoadingStory: sinon.spy(),
    addAttachment: sinon.spy(),
    removeAttachment: sinon.spy(),
    users: [],
    project: { labels: [] },
    enabled: true,
    onClone: sinon.spy(),
    showHistory: sinon.spy(),
    disabled: false
  });

  it("renders all children components when isn't a new story", () => {
    const story = {
      ...storyFactory({ id: 42 }),
      _editing: storyFactory({ id: 42 })
    }

    const wrapper = shallow(
      <ExpandedStoryDefault
        {...defaultProps()}
        story={story}
      />
    );

    expect(wrapper.find('ExpandedStoryHistoryLocation')).toExist();
    expect(wrapper.find('ExpandedStoryTitle')).toExist();
    expect(wrapper.find('ExpandedStoryEstimate')).toExist();
    expect(wrapper.find('ExpandedStoryType')).toExist();
    expect(wrapper.find('ExpandedStoryState')).toExist();
    expect(wrapper.find('ExpandedStoryRequestedBy')).toExist();
    expect(wrapper.find('ExpandedStoryOwnedBy')).toExist();
    expect(wrapper.find('ExpandedStoryLabels')).toExist();
    expect(wrapper.find('ExpandedStoryDescription')).toExist();
    expect(wrapper.find('ExpandedStoryTask')).toExist();
    expect(wrapper.find('ExpandedStoryAttachments')).toExist();
    expect(wrapper.find('ExpandedStoryNotes')).toExist();
  });

  it('not renders some components when it is a new story', () => {
    const story = {
      ...storyFactory({ id: null }),
      _editing: storyFactory({ id: null })
    }

    const wrapper = shallow(
      <ExpandedStoryDefault
        {...defaultProps()}
        story={story}
      />
    );

    expect(wrapper.find('ExpandedStoryHistoryLocation')).not.toExist();
    expect(wrapper.find('ExpandedStoryTitle')).toExist();
    expect(wrapper.find('ExpandedStoryEstimate')).toExist();
    expect(wrapper.find('ExpandedStoryType')).toExist();
    expect(wrapper.find('ExpandedStoryState')).toExist();
    expect(wrapper.find('ExpandedStoryRequestedBy')).toExist();
    expect(wrapper.find('ExpandedStoryOwnedBy')).toExist();
    expect(wrapper.find('ExpandedStoryLabels')).toExist();
    expect(wrapper.find('ExpandedStoryDescription')).toExist();
    expect(wrapper.find('ExpandedStoryTask')).not.toExist();
    expect(wrapper.find('ExpandedStoryAttachments')).not.toExist();
    expect(wrapper.find('ExpandedStoryNotes')).not.toExist();
  });
});
