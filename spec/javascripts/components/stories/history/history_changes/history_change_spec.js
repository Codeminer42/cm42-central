import React from 'react';
import { render } from '@testing-library/react';
import HistoryChange from 'components/stories/History/HistoryChanges/HistoryChange';

describe('<HistoryChange />', () => {
  const renderComponent = overrideProps => {
    const defaultProps = {
      oldValue: 'oldValue',
      newValue: 'newValue',
      title: 'title',
    };

    const { container: wrapper } = render(
      <HistoryChange {...defaultProps} {...overrideProps} />
    );

    const oldValue = wrapper.querySelector('[data-id="history-old-value"]');
    const newValue = wrapper.querySelector('[data-id="history-new-value"]');
    const title = wrapper.querySelector('[data-id="history-change-title"]');

    return { wrapper, oldValue, newValue, title };
  };

  it('renders the component', () => {
    const { wrapper } = renderComponent();

    expect(wrapper).toBeInTheDocument();
  });

  it('renders old value', () => {
    const { oldValue } = renderComponent();

    expect(oldValue).toBeInTheDocument();
  });

  it('renders new value', () => {
    const { newValue } = renderComponent();

    expect(newValue).toBeInTheDocument();
  });

  it('renders the title', () => {
    const { title } = renderComponent();

    expect(title).toBeInTheDocument();
  });
});
