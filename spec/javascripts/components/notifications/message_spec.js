import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Message from 'components/Notifications/Message';

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

  it('calls onRemove when click on the remove button', () => {
    const onRemove = vi.fn();

    const { getByTestId } = render(
      <Message {...defaultProps()} onRemove={onRemove} />
    );

    const closeButton = getByTestId('message-close-button');
    fireEvent.click(closeButton);

    expect(onRemove).toHaveBeenCalled();
  });
});
