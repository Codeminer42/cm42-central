import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryState from 'components/story/ExpandedStory/ExpandedStoryState';
import { states } from '../../../../../app/assets/javascripts/models/beta/story';

describe('<ExpandedStoryState />', () => {
  it('renders component title', () => {
    const story = { state: 'started', _editing: { state: 'started' } };

    const wrapper = shallow(<ExpandedStoryState story={story} />);

    expect(wrapper.text()).toContain(I18n.t('activerecord.attributes.story.state'));
  });

  describe("states at select", () => {
    states.map(state => {
      it(`sets select value as ${state}`, () => {
        const story = {
          _editing: { state: state }
        };

        const wrapper = shallow(<ExpandedStoryState story={story} />);
        const select = wrapper.find('select');

        expect(select.prop('value')).toBe(state);
      });
    });
  });

  describe('onChange', () => {
    it('calls onEdit with story description on textarea change', () => {
      const state = states[0];
      const change = states[1];

      const story = {
       _editing: { state }
      };

      const onEdit = sinon.spy();

      const wrapper = shallow(<ExpandedStoryState story={story} onEdit={onEdit} />);
      const select = wrapper.find('select');

      select.simulate('change', { target: { value: change } });

      expect(onEdit).toHaveBeenCalledWith({ state: change });
    });
  });
});
