import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryType from 'components/story/ExpandedStory/ExpandedStoryType';
import { types } from 'models/beta/story';

describe('<ExpandedStoryType />', () => {
  types.forEach((type) => {
    it(`sets defaultValue as ${type} in select`, () => {
      const onEdit = sinon.spy();
      const story = { _editing: { storyType: type } };
      const wrapper = shallow(<ExpandedStoryType story={story} onEdit={onEdit} />);
      const select = wrapper.find('select');

      expect(select.prop('value')).toBe(type);
    });
  });
});
