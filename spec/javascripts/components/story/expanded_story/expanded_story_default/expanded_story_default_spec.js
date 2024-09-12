import React from 'react';
import { shallow } from 'enzyme';
import { ExpandedStoryDefault } from 'components/story/ExpandedStory/ExpandedStoryDefault';
import storyFactory from '../../../../support/factories/storyFactory';
import { createTemporaryId } from '../../../../../../app/assets/javascripts/models/beta/story';

describe('<ExpandedStoryDefault />', () => {
  const defaultProps = () => ({
    story: {
      ...storyFactory(),
      _editing: storyFactory(),
    },
    onEdit: vi.fn(),
    storyFailure: vi.fn(),
    createTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTask: vi.fn(),
    deleteNote: vi.fn(),
    createNote: vi.fn(),
    addLabel: vi.fn(),
    removeLabel: vi.fn(),
    setLoadingStory: vi.fn(),
    users: [],
    project: { labels: [] },
    enabled: true,
    onClone: vi.fn(),
    showHistory: vi.fn(),
    disabled: false,
  });

  it("renders all children components when isn't a new story", () => {
    const story = {
      ...storyFactory({ id: 42 }),
      _editing: storyFactory({ id: 42 }),
    };

    const wrapper = shallow(
      <ExpandedStoryDefault {...defaultProps()} story={story} />
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
    expect(wrapper.find('ExpandedStoryNotes')).toExist();
  });

  it('not renders some components when it is a new story', () => {
    const id = createTemporaryId();
    const story = {
      ...storyFactory({ id }),
      _editing: storyFactory({ id }),
    };

    const wrapper = shallow(
      <ExpandedStoryDefault {...defaultProps()} story={story} />
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
    expect(wrapper.find('ExpandedStoryNotes')).not.toExist();
  });
});
