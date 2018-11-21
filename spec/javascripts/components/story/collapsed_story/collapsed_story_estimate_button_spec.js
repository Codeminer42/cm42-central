import React from 'react';
import { shallow } from 'enzyme';
import { CollapsedStoryEstimateButton } from 'components/story/CollapsedStory/CollapsedStoryEstimateButton';

describe('<CollapsedStoryEstimateButton />', () => {
  it("renders component with 'Fibonacci' point scale", () => {
    const project = { pointValues: ['1','2','3','5','8'] }
    const wrapper = shallow(<CollapsedStoryEstimateButton project={project}/>);
    const text = wrapper.text()

    project.pointValues.forEach((value)=>{
      expect(text).toContain(value)
    });
  });

  it("renders component with 'Powers of two' point scale", () => {
    const project = { pointValues: ['1','2','4','8'] }
    const wrapper = shallow(<CollapsedStoryEstimateButton project={project}/>);
    const text = wrapper.text()

    project.pointValues.forEach((value)=>{
      expect(text).toContain(value)
    });
  });

  it("renders component with 'Linear' point scale", () => {
    const project = { pointValues: ['1','2','3','4','5'] }
    const wrapper = shallow(<CollapsedStoryEstimateButton project={project}/>);
    const text = wrapper.text()

    project.pointValues.forEach((value)=>{
      expect(text).toContain(value)
    });
  });
});
