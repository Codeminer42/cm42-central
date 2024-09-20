import React from 'react';
import { render } from '@testing-library/react';
import History from '../../../../../app/assets/javascripts/components/stories/History/index';
import HistoryFactory from '../../../support/factories/historyFactory';

describe('<History />', () => {
  const renderComponent = () => {
    const { container: wrapper } = render(
      <History history={HistoryFactory()} />
    );

    const historyActivity = wrapper.querySelector('.HistoryItem');

    return { wrapper, historyActivity };
  };

  it('renders the component', () => {
    const { wrapper } = renderComponent();

    expect(wrapper).toBeInTheDocument();
  });

  it('renders <historyActivity />', () => {
    const { historyActivity } = renderComponent();

    expect(historyActivity).toBeInTheDocument();
  });
});
