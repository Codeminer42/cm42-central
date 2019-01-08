import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryLabels from 'components/story/ExpandedStory/ExpandedStoryLabels';

fdescribe('<ExpandedStoryLabels />', () => {
  it('renders component title', () => {
    const labels = 'front,back';

    const wrapper = shallow(<ExpandedStoryLabels labels={labels} />);

    expect(wrapper.text()).toContain(I18n.t('activerecord.attributes.story.labels'));
  });

  describe('<ReactTags />', () => {
    it('renders with the right tags prop', () => {
      const labels = 'front,back';

      const expectedTags = [
        { id: 0, name: 'front' },
        { id: 1, name: 'back' }
      ];

      const wrapper = shallow(<ExpandedStoryLabels labels={labels} />);

      expect(wrapper.find('ReactTags').prop('tags')).toEqual(expectedTags);
    });
  });
});
