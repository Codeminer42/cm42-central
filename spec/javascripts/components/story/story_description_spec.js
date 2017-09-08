import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { mount } from 'enzyme';

import StoryDescription from 'components/story/StoryDescription';
import StoryLink from 'components/stories/StoryLink';

describe('<StoryDescription />', function() {

  beforeEach(function() {
    jasmineEnzyme();
    sinon.stub(window.md, 'makeHtml');
    this.story = {id: 5, description: 'Description'};
  });

  afterEach(function() {
    window.md.makeHtml.restore();
  });

  it("should ignore when there are no valid ids", function() {
    const wrapper = mount(
      <StoryDescription
        name='description'
        linkedStories={{}}
        isReadonly={false}
        description={this.story.description}
        isNew={false}
        editingDescription={false}
        value={""}
      />
    );
    expect(wrapper.find('.description').text()).toContain('Description');
  });

  it("should turn a valid id into a StoryLink", function() {
    const linkedStory = {
      id: 9,
      get: sinon.stub().returns('unscheduled'),
      created_at: sinon.stub(),
      humanAttributeName: sinon.stub(),
      escape: sinon.stub(),
      hasNotes: sinon.stub()
    };
    const wrapper = mount(
      <StoryDescription
        name='description'
        linkedStories={{'9': linkedStory}}
        isReadonly={false}
        description={'Description <a data-story-id="9"></a>'}
        isNew={false}
        editingDescription={false}
        value={""}
      />
    );
    expect(wrapper.find(StoryLink)).toHaveProp('story', linkedStory);
  });

  it("should render markdown transformed as html", function () {
    const wrapper = mount(
      <StoryDescription
        name='description'
        linkedStories={{}}
        isReadonly={false}
        description={'# Header test'}
        isNew={false}
        editingDescription={false}
        value={""}
      />
    );
    expect(wrapper.find('h1#headertest')).toBePresent();
    expect(wrapper.find('h1#headertest').text()).toContain('Header test');
  })
});
