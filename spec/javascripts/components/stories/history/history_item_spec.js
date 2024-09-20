import React from 'react';
import { render } from '@testing-library/react';
import HistoryItem from '../../../../../app/assets/javascripts/components/stories/History/HistoryItem';

describe('<HistoryItem />', () => {
  const renderComponent = overrideProps => {
    const defaultProps = {
      title: 'title',
      date: '2019/08/27 14:18:00 -0300',
      user: 'i am user',
      changes: ['test1', 'test2'],
    };

    const { container: wrapper, debug } = render(
      <HistoryItem {...defaultProps} {...overrideProps} />
    );

    const header = wrapper.querySelector('[data-id="history-header-title"]');
    const changes = wrapper.querySelector('[data-id="history-change-title"]');

    return { wrapper, header, changes };
  };

  it('renders the component', () => {
    const { wrapper } = renderComponent();

    expect(wrapper).toBeInTheDocument();
  });

  it('renders header', () => {
    const { header } = renderComponent();

    expect(header).toBeInTheDocument();
  });

  it('renders changes', () => {
    const { changes } = renderComponent();

    expect(changes).toBeInTheDocument();
  });
});
