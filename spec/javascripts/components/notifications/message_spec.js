import React from 'react';
import { shallow } from 'enzyme';
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

    const wrapper = shallow(<Message {...defaultProps()} type={messageType} />);

    expect(wrapper.find(`.Message--${messageType}`)).toExist();
  });

  it('renders component with the right message', () => {
    const message = 'error message';

    const wrapper = shallow(<Message {...defaultProps()} message={message} />);

    expect(wrapper.text()).toContain(message);
  });

  it('calls onRemove when click on the remove button', () => {
    const onRemove = vi.fn();

    const wrapper = shallow(
      <Message {...defaultProps()} onRemove={onRemove} />
    );

    const button = wrapper.find('#close-button');
    button.simulate('click');

    expect(onRemove).toHaveBeenCalled();
  });
});
