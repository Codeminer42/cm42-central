import React from 'react';
import { shallow } from 'enzyme';
import { ExpandedStoryEstimate } from 'components/story/ExpandedStory/ExpandedStoryEstimate';

describe('<ExpandedStoryEstimate />', () => {
  it("renders component with 'Fibonacci' point scale select", () => {
    const project = { pointValues: ['1','2','3','5','8'] };
    const story = { estimate: null };

    const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);
    const select = wrapper.find('select').text();

    project.pointValues.forEach((value) => {
      expect(select).toContain(value);
    });
  });

  it("renders component with 'Powers of two' point scale select", () => {
    const project = { pointValues: ['1','2','4','8'] };
    const story = { estimate: null };

    const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);
    const select = wrapper.find('select').text();

    project.pointValues.forEach((value) => {
      expect(select).toContain(value);
    });
  });

  it("renders component with 'Linear' point scale select", () => {
    const project = { pointValues: ['1','2','3','4','5'] };
    const story = { estimate: null };

    const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);
    const select = wrapper.find('select').text();

    project.pointValues.forEach((value) => {
      expect(select).toContain(value);
    });
  });

  describe("sets defaultValue as story.estimate in select", () => {
    it("story.estimate is a value", () => {
      const project = { pointValues: ['1','2','3','5','8'] };

      project.pointValues.forEach((value) => {
        const story = { estimate: value };
        const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);
        const select = wrapper.find('select');

        expect(select.props().defaultValue).toBe(value);
      })
    });

    it("story.estimate is null", () => {
      const project = { pointValues: ['1','2','3','4','5'] };
      const story = { estimate: null };

      const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);
      const select = wrapper.find('select');

      expect(select.props().defaultValue).toBe(null);
    });
  });
});
