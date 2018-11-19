import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryPoints from 'components/story/CollapsedStory/CollapsedStoryPoints';
import CollapsedStoryStateActions from 'components/story/CollapsedStory/CollapsedStoryStateActions';
import storyFactory from '../../../support/factories/storyFactory';

describe('<CollapsedStoryStateActions />', () => {
  describe('When estimate is null', () => {
    it("renders <CollapsedStoryPoints /> component", () => {
      const props = storyFactory({estimate: null});
      const wrapper = shallow(<CollapsedStoryStateActions story={props} />);
      
      expect(wrapper.find(CollapsedStoryPoints)).toExist();
    });
  });

  describe('When estimate is not null', () => {
    const states = [
      { state: "started", actions: ["finish"] },
      { state: "finished", actions: ["deliver"] },
      { state: "delivered", actions: ["accept", "reject"] },
      { state: "rejected", actions: ["restart"] },
      { state: "unstarted", actions: ["start"] },
      { state: "", actions: ["start"] }
    ];

    states.forEach(({ state, actions }) => {
      describe(`When state = ${state}`, () => {
        it('renders the <CollapsedStoryStateButton /> component', () => {
          const props = storyFactory({state})
          const wrapper = shallow(<CollapsedStoryStateActions story={props} />);

          actions.forEach((action) => {
            expect(wrapper.find(`CollapsedStoryStateButton[action="${action}"]`)).toExist();
          });
        });
      });
    });

    describe("When state =  'accepted' ", () => {
      it('Doesn\'t render <CollapsedStoryStateButton /> component', () => {
        const props = storyFactory({state: 'accepted'})
        const wrapper = shallow(<CollapsedStoryStateActions story={props} />);

        expect(wrapper.find('CollapsedStoryStateButton')).not.toExist();
      });
    });
  });
});
