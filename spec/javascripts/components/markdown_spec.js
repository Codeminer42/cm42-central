import React from 'react';
import { shallow } from 'enzyme';
import Markdown from 'components/Markdown';

describe('<Markdown />', () => {
  const source = 'some text';

  beforeEach(() => {
    vi.fn(window.md, 'makeHtml').mockReturnValueOnce(source);
  });

  afterEach(() => {
    window.md.makeHtml.mockRestore();
  });

  describe('When source isnt null', () => {
    it('renders the source text with markdown', () => {
      const wrapper = shallow(<Markdown source={source} />);

      expect(wrapper.text()).toContain(source);
    });
  });
});
