import React from 'react';
import { shallow } from 'enzyme';
import { ExpandedStoryEstimate } from 'components/story/ExpandedStory/ExpandedStoryEstimate';

describe('<ExpandedStoryEstimate />', () => {
  it("renders component with 'Fibonacci' point scale in select", () => {
    const project = { pointValues: ['1','2','3','5','8'] };
    const story = { estimate: null };

    const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);
    const select = wrapper.find('select').text();

    project.pointValues.forEach((value) => {
      expect(select).toContain(value);
    });
  });

  it("renders component with 'Powers of two' point scale in select", () => {
    const project = { pointValues: ['1','2','4','8'] };
    const story = { estimate: null };

    const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);
    const select = wrapper.find('select').text();

    project.pointValues.forEach((value) => {
      expect(select).toContain(value);
    });
  });

  it("renders component with 'Linear' point scale in select", () => {
    const project = { pointValues: ['1','2','3','4','5'] };
    const story = { estimate: null };

    const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);
    const select = wrapper.find('select').text();

    project.pointValues.forEach((value) => {
      expect(select).toContain(value);
    });
  });

  describe("When story.estimate is not null", () => {
    it("sets the select defaultValue as story.estimate", () => {
      const project = { pointValues: ['1','2','3','5','8'] };

      project.pointValues.forEach((value) => {
        const story = { estimate: value };
        const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);
        const select = wrapper.find('select');

        expect(select.props().defaultValue).toBe(value);
      });
    });
  });

  describe("When story.estimate is null", () => {
    it("sets the select defaultValue as null", () => {
      const project = { pointValues: ['1','2','3','4','5'] };
      const story = { estimate: null };

      const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);
      const select = wrapper.find('select');

      expect(select.props().defaultValue).toBe(null);
    });
  });

  describe("When change storyType", () => {
    describe("to a type that is not a feature", () =>{
      const notFeatureTypes = ['bug', 'release', 'chore'];

      it("disables estimate select", () =>{
        const project = { pointValues: ['1','2','3','4','5'] };

        notFeatureTypes.forEach((type) => {
          const story = { storyType: type };
          const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);

          const select = wrapper.find('select');

          expect(select.props().disabled).toBe(true);
        });
      });
    });

    describe("to a feature", () =>{
      it("not disable estimate select", () =>{
        const project = { pointValues: ['1','2','3','4','5'] };
        const story = { storyType: 'bug' };
        
        const wrapper = shallow(<ExpandedStoryEstimate project={project} story={story}/>);
        const select = wrapper.find('select');
        
        expect(select.props().disabled).toBe(true);
      });
    });
  });
});
