import React from "react";
import { shallow } from "enzyme";
import HistoryChange from "components/stories/History/HistoryChanges/HistoryChange";

describe('<HistoryChange />', () => {
  const render = overrideProps => {
    const defaultProps = {
      oldValue: 'oldValue',
      newValue: 'newValue',
      title: 'title'
    };

    const wrapper = shallow(<HistoryChange {...defaultProps} {...overrideProps} />);
    const oldValue = wrapper.find('[data-id="history-old-value"]');
    const newValue = wrapper.find('[data-id="history-new-value"]');
    const title = wrapper.find('[data-id="history-change-title"]');

    return { wrapper, oldValue, newValue, title };
  };

  it('renders the component', () => {
    const { wrapper } = render();

    expect(wrapper).toExist();
  });

  it('renders old value', () => {
    const { oldValue } = render();

    expect(oldValue).toExist();
  });

  it('renders new value', () => {
    const { newValue } = render();

    expect(newValue).toExist();
  });

  it('renders the title', () => {
    const { title } = render();

    expect(title).toExist();
  });
});
