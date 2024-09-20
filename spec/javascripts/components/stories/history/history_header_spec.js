import React from 'react';
import { render } from '@testing-library/react';
import HistoryHeader from '../../../../../app/assets/javascripts/components/stories/History/HistoryHeader';

describe('HistoryHeader', () => {
  const renderComponent = overrideProps => {
    const defaultProps = {
      title: 'title',
      user: 'user',
      date: '2019/08/27 14:18:00 -0300',
    };

    const { container: wrapper } = render(
      <HistoryHeader {...defaultProps} {...overrideProps} />
    );
    const title = wrapper.querySelector('[data-id="history-header-title"]');
    const date = wrapper.querySelector('[data-id="history-header-date"]');

    return { wrapper, title, date };
  };

  it('renders the component', () => {
    const { wrapper } = renderComponent();

    expect(wrapper).toBeInTheDocument();
  });

  it('renders the title', () => {
    const { title } = renderComponent();

    expect(title).toBeInTheDocument();
  });

  it('renders the date', () => {
    const { date } = renderComponent();

    expect(date).toBeInTheDocument();
  });

  describe('title', () => {
    const user = 'i am user!';

    it('title contains user', () => {
      const { title } = renderComponent({ user });

      expect(title.innerHTML).toContain(user);
    });
  });
});
