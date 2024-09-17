import React from 'react';
import { getAllByText, render } from '@testing-library/react';
import Notifications from 'components/Notifications';

describe('<Notifications />', () => {
  const defaultProps = () => ({
    messages: [],
    onRemove: vi.fn(),
  });

  it('renders component with the right number of messages', () => {
    const notifications = [
      { id: 1, message: 'message', type: 'success' },
      { id: 2, message: 'message', type: 'error' },
      { id: 3, message: 'message' },
    ];

    const { getAllByText } = render(
      <Notifications {...defaultProps()} notifications={notifications} />
    );

    expect(getAllByText('message').length).toBe(notifications.length);
  });
});
