import React from 'react';
import { render } from '@testing-library/react';
import Markdown from 'components/Markdown';

describe('<Markdown />', () => {
  const source = 'some text';

  beforeEach(() => {
    vi.spyOn(window.md, 'makeHtml').mockReturnValueOnce(source);
  });

  afterEach(() => {
    window.md.makeHtml.mockRestore();
  });

  describe('When source isnt null', () => {
    it('renders the source text with markdown', () => {
      const { container } = render(<Markdown source={source} />);

      expect(container.innerHTML).toContain(source);
    });
  });
});
