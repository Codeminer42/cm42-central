import React from "react";
import { shallow } from "enzyme";
import HistoryItem from "../../../../../app/assets/javascripts/components/stories/History/HistoryItem";

describe('<HistoryItem />', () => {
  const render = overrideProps => {
    const defaultProps = {
      title: 'title',
      date: '2019/08/27 14:18:00 -0300',
      user: 'i am user',
      changes: []
    };

    const wrapper = shallow(<HistoryItem {...defaultProps} {...overrideProps} />);
    const header = wrapper.find('[data-id="history-header"]');
    const changes = wrapper.find('[data-id="history-changes"]');

    return { wrapper, header, changes };
  };

  it('renders the component', () => {
    const { wrapper } = render();

    expect(wrapper).toExist();
  });

  it('renders header', () => {
    const { header } = render();

    expect(header).toExist();
  });

  it('renders changes', () => {
    const { changes } = render();
    
    expect(changes).toExist();
  });
});
