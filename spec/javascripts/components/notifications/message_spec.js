import React from 'react';
import { render } from '@testing-library/react';
import Message from 'components/Notifications/Message';
import { user } from '../../support/setup';

describe('<Message />', () => {
  const defaultProps = () => ({
    type: 'success',
    className: 'Notifications__Message',
    message: 'success',
    onRemove: vi.fn(),
  });

  it('renders component with the right type on className', () => {
    const messageType = 'error';

    const { getByTestId } = render(
      <Message {...defaultProps()} type={messageType} />
    );

    expect(getByTestId('message-container')).toBeInTheDocument();
  });

  it('renders component with the right message', () => {
    const message = 'error message';

    const { getByText } = render(
      <Message {...defaultProps()} message={message} />
    );

    expect(getByText(message)).toBeDefined();
  });

  it('calls onRemove when click on the remove button', async () => {
    const onRemove = vi.fn();

    const { container } = render(
      <Message {...defaultProps()} onRemove={onRemove} />
    );

    const closeButton = container.querySelector('.Message__content__button');
    await user.click(closeButton);

    expect(onRemove).toHaveBeenCalled();
  });
});
