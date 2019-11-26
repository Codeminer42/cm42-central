import React from 'react';
import { mount } from 'enzyme';

import StoryDescription from 'components/story/StoryDescription';
import StoryLink from 'components/stories/StoryLink';

describe('<StoryDescription />', function() {
  let story;

  beforeEach(function() {
    sinon.stub(window.md, 'makeHtml');
    story = {id: 5, description: 'Description'};
  });

  afterEach(function() {
    window.md.makeHtml.restore();
  });

  it("should ignore when there are no valid ids", function() {
    window.md.makeHtml.returns("<p>Description</p>");
    const wrapper = mount(
      <StoryDescription
        name='description'
        linkedStories={{}}
        isReadonly={false}
        description={story.description}
        isNew={false}
        editingDescription={false}
        value={""}
      />
    );
    expect(window.md.makeHtml).toHaveBeenCalledWith("Description");
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
    window.md.makeHtml.returns("<p>Description <a data-story-id='9'></a></p>");
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
    expect(window.md.makeHtml).toHaveBeenCalledWith('Description <a data-story-id="9"></a>');
    expect(wrapper.find(StoryLink).prop('story')).toBe(linkedStory);
  });

  it("should render markdown transformed as html", function () {
    window.md.makeHtml.returns("<h1>Header test</h1>");
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
    expect(window.md.makeHtml).toHaveBeenCalledWith('# Header test');
    expect(wrapper.find('h1')).toExist();
    expect(wrapper.find('h1').text()).toContain('Header test');
  })
});
