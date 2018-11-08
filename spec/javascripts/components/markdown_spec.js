import React from 'react';
import { shallow } from 'enzyme';
import Markdown from 'components/Markdown';

describe('<Markdown />', () => {
  describe('When source isnt null', () => {
    it('renders the source text with markdown', () => {
      const source = 'some text'
      const wrapper = shallow(<Markdown source={source} />);

      expect(wrapper.find(`.Markdown`).text()).toContain(source);
    });
  });
});
