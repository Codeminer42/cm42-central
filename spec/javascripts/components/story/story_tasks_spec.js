import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { mount, shallow } from 'enzyme';

import StoryTasks from 'components/story/StoryTasks';
import Task from 'components/tasks/Task';

describe('<StoryTasks />', function() {
  let story;

  beforeEach(function() {
    jasmineEnzyme();
    sinon.stub(I18n, 't');
  });

  afterEach(function() {
    I18n.t.restore();
  });

  it("should render a list of <Task /> components", function() {
    const task = {
      get: sinon.stub(),
      escape: sinon.stub().returns('Test')
    };

    const wrapper = mount(
      <StoryTasks tasks={[task]} disabled={false} />
    );
    expect(wrapper.find('.task')).toBePresent();
  });

  describe("with an empty collection", function() {

    it("should still have a label", function() {
      const wrapper = shallow(
        <StoryTasks tasks={[]} disabled={false} />
      );
      expect(I18n.t).toHaveBeenCalledWith('story.tasks');
    });

  });

});
