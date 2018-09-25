import jasmineEnzyme from "jasmine-enzyme";
import React from "react";
import { shallow } from "enzyme";
import Sprint from "components/stories/Sprint";

let props = {};
let wrapper = {};

const createProps = () => ({
  number: 1,
  startDate: "2018/09/03",
  points: 3,
  completedPoints: 0,
  stories: [
    {
      id: 1,
      position: "3",
      state: "unstarted",
      estimate: 1,
      storyType: "feature"
    },
    {
      id: 2,
      position: "2",
      state: "unstarted",
      estimate: 1,
      storyType: "feature"
    }
  ]
});

describe("<Sprint />", () => {
  beforeEach(() => {
    jasmineEnzyme();
    props = createProps();
    wrapper = shallow(<Sprint {...props} />);
  });

  it('renders a <div> with class ".Sprint"', () => {
    expect(wrapper.find("div.Sprint")).toHaveLength(1);
  });

  it('renders a div with class ".Sprint__header"', () => {
    expect(wrapper.find("div.Sprint__header")).toHaveLength(1);
  });

  it('renders a div with class ".Sprint__body"', () => {
    expect(wrapper.find("div.Sprint__body")).toHaveLength(1);
  });

  it("renders a <Stories> components", () => {
    expect(wrapper.find("Stories")).toHaveLength(1);
  });

  describe("when no stories are passed as props", () => {
    beforeEach(() => {
      props = createProps();
      props.stories = null;
      wrapper = shallow(<Sprint {...props} />);
    });
    it("does not render any <Stories> component", () => {
      expect(wrapper.find("Stories")).toHaveLength(0);
    });
  });
});
