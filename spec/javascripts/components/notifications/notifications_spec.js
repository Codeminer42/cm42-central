import React from 'react';
import { shallow } from 'enzyme';
import Notifications from 'components/Notifications';

describe('<Notifications />', () => {
  const defaultProps = () => ({
    messages: []
  });

  it('renders component with the right number of messages', () => {
    const notifications = [
      { id: 1, message: 'message1', type: 'success' },
      { id: 2, message: 'message2', type: 'error' },
      { id: 3, message: 'message3' }
    ];

    const wrapper = shallow(
      <Notifications
        {...defaultProps()}
        notifications={notifications}
      />
    );

    expect(wrapper.find('Message').length).toBe(notifications.length);
  });
});
