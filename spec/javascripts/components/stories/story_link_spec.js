import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';

import StoryLink from 'components/stories/StoryLink';

import Story from 'models/story.js';

const story = {
  title: 'Story 2',
  created_at: sinon.stub(),
  get: sinon.stub(),
  humanAttributeName: sinon.stub().returns('Description'),
  escape: sinon.stub().returns('description'),
  hasNotes: sinon.stub().returns(false),
  views: [{highlight: sinon.stub()}]
};

story.get.withArgs('id').returns('2');
story.get.withArgs('requested_by_name').returns('Test');
story.get.withArgs('state').returns('unscheduled');
story.get.withArgs('story_type').returns('feature');

describe('<StoryLink />', function() {

  beforeEach(function() {
    jasmineEnzyme();
    sinon.stub(I18n, 't');
    sinon.stub(window.md, 'makeHtml');
    sinon.stub(document, 'getElementById');
    document.getElementById.returns({scrollIntoView: sinon.stub()});
  });

  afterEach(function() {
    I18n.t.restore();
    window.md.makeHtml.restore();
    document.getElementById.restore();
  });

  it("should have his id as content", function() {
    const wrapper = shallow( <StoryLink story={story} /> );
    expect(wrapper.find('.story-link')).toHaveText('#2');
  });

  it("should highlight on click", function() {
    const wrapper = shallow( <StoryLink story={story} /> );
    wrapper.find('.story-link').simulate('click');
    expect(story.views[0].highlight).toHaveBeenCalled();
  });

  describe(".story-link-icon", function() {

    it("should not exist when story's state is unscheduled", function() {
      const wrapper = shallow( <StoryLink story={story} /> );
      expect(wrapper.find('.story-link-icon').length).toBe(0);
    });

    it("should have a material icon when state is not unscheduled", function() {
      story.get.withArgs('state').returns('accepted');
      const wrapper = shallow( <StoryLink story={story} /> );
      expect(wrapper.find('.story-link-icon')).toHaveText('done');
    });

  });

});
