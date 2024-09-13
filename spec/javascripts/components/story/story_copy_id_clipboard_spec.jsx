import React from 'react';
import StoryCopyIdClipboard from 'components/story/StoryCopyIdClipboard';
import { render } from '@testing-library/react';

describe('<StoryCopyIdClipboard />', function () {
  let fn;

  beforeEach(function () {
    fn = vi.spyOn(I18n, 't');
  });

  afterEach(function () {
    fn.mockRestore();
  });

  it.only('should render story id text', function () {
    const component = render(<StoryCopyIdClipboard id={70} />);
    expect(component.getByText('#70')).toBeInTheDocument();
  });

  /*   it('should render story id data-clipboard-text', function () {
    const component = render(<StoryCopyIdClipboard id={70} />);
    expect(component.getByTestId('#70')).toBeInTheDocument();
  });

  it('should render copy id title', function () {
    render(<StoryCopyIdClipboard id={70} />);
    expect(fn).toHaveBeenCalledWith('story.events.copy_id');
  }); */
});
