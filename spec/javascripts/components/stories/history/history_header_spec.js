import React from "react";
import { shallow } from "enzyme";
import HistoryHeader from "../../../../../app/assets/javascripts/components/stories/History/HistoryHeader";

describe('HistoryHeader', () => {
  const render = overrideProps => {
    const defaultProps = {
      title: 'title',
      user: 'user',
      date: '2019/08/27 14:18:00 -0300'
    };

    const wrapper = shallow(<HistoryHeader {...defaultProps} {...overrideProps} />);
    const title = wrapper.find('[data-id="history-header-title"]');
    const date = wrapper.find('[data-id="history-header-date"]');
    return { wrapper, title, date }
  };

  it('renders the component', () => {
    const { wrapper } = render();

    expect(wrapper).toExist();
  });

  it('renders the title', () => {
    const { title } = render();

    expect(title).toExist();
  });

  it('renders the date', () => {
    const { date } = render();

    expect(date).toExist();
  });

  describe('title', () => {
    const user = 'i am user!';

    it('title contains user', () => {
      const { title } = render({ user });

      expect(title.text()).toContain(user);
    });
  });
});
