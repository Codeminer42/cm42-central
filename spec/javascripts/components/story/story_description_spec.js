import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';

import StoryDescription from 'components/story/StoryDescription';
import StoryLink from 'components/stories/StoryLink';

describe('<StoryDescription />', function() {

  beforeEach(function() {
    jasmineEnzyme();

    this.story = {id: 5, description: 'Description'};
  });

  it("should ignore when there are no valid ids", function() {
    const wrapper = shallow(
      <StoryDescription
        linkedStories={{}}
        isReadonly={false}
        description={this.story.description} />
    );
    expect(wrapper.find('.description')).toHaveText('Description');
  });

  it("should turn a valid id into a StoryLink", function() {
    const linkedStory = {id: 9, get: sinon.stub().returns('unscheduled')};
    const wrapper = shallow(
      <StoryDescription
        linkedStories={{'9': linkedStory}}
        isReadonly={false}
        description={'Description <a data-story-id="9"></a>'} />
    );
    expect(wrapper.find(StoryLink)).toHaveProp('story', linkedStory);
  });

});
