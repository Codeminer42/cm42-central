import React from 'react';
import { shallow } from 'enzyme';
import Markdown from 'components/Markdown';

describe('<Markdown />', () => {
  const source = 'some text';

  beforeEach(() => {
    sinon.stub(window.md, 'makeHtml').returns(source);
  });

  afterEach(() => {
    window.md.makeHtml.restore();
  });

  describe('When source isnt null', () => {
    it('renders the source text with markdown', () => {
      const wrapper = shallow(<Markdown source={source} />);

      expect(wrapper.text()).toContain(source);
    });
  });
});
