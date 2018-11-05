import React from 'react';
import { shallow } from 'enzyme';
import StoryItem, {
  StoryPoints,
  StateActions,
  StateButton
} from 'components/story/StoryItem';

describe('<StateActions />', () => {
  describe('When estimate is null',() => {
    it("renders <StoryPoints /> component", () => {
      const props = {
        storyType: "feature",
        estimate: null,
        state: "started"
      };
      const wrapper = shallow(<StateActions {...props} />);
      expect(wrapper.find(StoryPoints)).toExist();
    });
  });
  describe('When estimate is not null', () => {
    const states = [
      { state: "started", actions: ["finish"] },
      { state: "finished", actions: ["deliver"] },
      { state: "delivered", actions: ["accept","reject"] },
      { state: "rejected", actions: ["restart"] },
      { state: "unstarted", actions: ["start"] },
      { state: "", actions: ["start"] }
    ];
    states.forEach(({ state, actions }) => {
      describe(`When state = ${state}`, () => {
        it('renders the <StateButton /> component',() => {
          const wrapper = shallow(<StateActions state={state} estimate={1} storyType="feature" />);
          actions.forEach((action) => {
            expect(wrapper.find(`StateButton[action="${action}"]`)).toExist();
          });
        });
      });
    });
    describe("When state =  'accepted' ", () => {
      it('Doesnt render <StateButton /> component', () => {
        const wrapper = shallow(<StateActions state='accepted' estimate={1} storyType="feature" />);
        expect(wrapper.find('StateButton')).not.toExist();
      });
    });
  });
});
