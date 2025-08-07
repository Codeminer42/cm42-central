import React from 'react';
import StoryCopyIdClipboard from 'components/story/StoryCopyIdClipboard';
import { render } from '@testing-library/react';
import { user } from '../../support/setup';

vi.mock('react-clipboard.js', () => ({
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe('<StoryCopyIdClipboard />', function () {
  it('should render story id text', function () {
    const component = render(<StoryCopyIdClipboard id={70} />);
    expect(component.getByText('#70')).toBeInTheDocument();
  });

  it('should render story id data-clipboard-text', function () {
    const component = render(<StoryCopyIdClipboard id={70} />);

    expect(
      component.container.querySelector('data-clipboard-textt')
    ).toBeDefined();
  });

  it('should copy correct id', async () => {
    const onCopy = vi.fn();

    const { container } = render(
      <StoryCopyIdClipboard id={70} onCopy={onCopy} />
    );

    const paragraph = container.querySelector('p');

    await user.click(paragraph);

    expect(onCopy).toHaveBeenCalledWith('#70', false);
  });
});
