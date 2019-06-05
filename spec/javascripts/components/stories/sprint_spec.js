import React from "react";
import { shallow } from "enzyme";
import Sprint from "components/stories/Sprint";

let sprint = {};
let wrapper = {};

const createSprint = propOverrides => ({
  number: 1,
  startDate: "2018/09/03",
  endDate: "2018/09/10",
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
  ],
  ...propOverrides
});

describe("<Sprint />", () => {
  beforeEach(() => {
    sprint = createSprint();
    wrapper = shallow(<Sprint sprint={sprint} />);
  });

  it('renders a <div> with class ".Sprint"', () => {
    expect(wrapper.find("div.Sprint").exists()).toBe(true);
  });

  it('renders a SprintHeader component"', () => {
    expect(wrapper.find('SprintHeader').exists()).toBe(true);
  });

  it('renders a div with class ".Sprint__body"', () => {
    expect(wrapper.find("div.Sprint__body").exists()).toBe(true);
  });

  it("renders a <Stories> components", () => {
    expect(wrapper.find("Stories").exists()).toBe(true);
  });

  describe("when no stories are passed as sprint", () => {
    beforeEach(() => {
      sprint = createSprint();
      sprint.stories = null;
      wrapper = shallow(<Sprint sprint={sprint} />);
    });

    it("does not render any <Stories> component", () => {
      expect(wrapper.find("Stories").exists()).toBe(false);
    });
  });

  describe('when story needs to fetch', () => {
    let fetchStories;

    beforeEach(() => {
      sprint = createSprint({ fetching: false, isFetched: false, hasStories: true });
      sprint.stories = null;
      fetchStories = sinon.stub();
      wrapper = shallow(<Sprint sprint={sprint} fetchStories={fetchStories} />);
    });

    it('calls fetchStories with iteration number, start and end date on user click', () => {
      const { number, startDate, endDate } = sprint;
      const header = wrapper.find('SprintHeader');

      header.simulate('click');

      expect(fetchStories).toHaveBeenCalledWith(number, startDate, endDate);
    });
  })
});
