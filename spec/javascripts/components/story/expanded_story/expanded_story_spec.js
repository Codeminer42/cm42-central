import React from 'react';
import { shallow } from 'enzyme';
import { ExpandedStory } from 'components/story/ExpandedStory/index';
import storyFactory from '../../../support/factories/storyFactory';

describe('<ExpandedStory />', () => {
  const defaultProps = () => ({
    story: storyFactory(),
    editStory: sinon.spy(),
    saveStory: sinon.spy(),
    storyFailure: sinon.spy(),
    createTask: sinon.spy(),
    deleteTask: sinon.spy(),
    toggleTask: sinon.spy(),
    deleteStory: sinon.spy(),
    deleteNote: sinon.spy(),
    createNote: sinon.spy(),
    addLabel: sinon.spy(),
    removeLabel: sinon.spy(),
    setLoadingStory: sinon.spy(),
    addAttachment: sinon.spy(),
    removeAttachment: sinon.spy(),
    users: [],
    project: { labels: [] },
    onToggle: sinon.spy()
  });

  it('renders children components', () => {
    const story = storyFactory({
      _editing: {
        ...storyFactory(),
        _isDirty: false
      }
    });
    const project = { id: 42, labels: [] };
    const wrapper = shallow(
      <ExpandedStory
        {...defaultProps()}
        story={story}
        project={project}
      />,
      { disableLifecycleMethods: true }
    );

    expect(wrapper.find('ExpandedStoryControls')).toExist();
    expect(wrapper.find('ExpandedStoryHistoryLocation')).toExist();
  });

  it('adds loading overlay when updating a story', () => {
    const story = storyFactory({
      _editing: {
        ...storyFactory({ loading: true }),
        _isDirty: false
      }
    });
    const project = { id: 42, labels: [] };
    const wrapper = shallow(
      <ExpandedStory
        {...defaultProps()}
        story={story}
        project={project}
      />,
      { disableLifecycleMethods: true }
    );

    expect(wrapper.find('div.Story__enable-loading')).toExist();
  })
});
