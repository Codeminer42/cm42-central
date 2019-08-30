import React from 'react';
import { shallow, mount } from 'enzyme';
import History, {
  Changes,
  Header
} from '../../../../app/assets/javascripts/components/stories/History';
import HistoryFactory from '../../support/factories/historyFactory';

describe('<History />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<History history={HistoryFactory()} />);
  });

  it('Should render a History', () => {
    expect(wrapper.find('.history-activity')).toExist();
    expect('history' in wrapper.props()).toEqual(true);
  });

  it('Should render a list of Changes', () => {
    expect(wrapper.find(Changes)).toExist();
    expect(
      Object.keys(
        wrapper
          .find(Changes)
          .at(1)
          .prop('changes')
      ).length
    ).toBe(6);
  });

  it('Should render a Header', () => {
    expect(wrapper.find(Header)).toExist();
    expect(wrapper.find(Header).length).toBe(2);
    expect(
      wrapper
        .find(Header)
        .at(0)
        .prop('title')
    ).toBe(I18n.t(`activity.actions.create`));
    expect(
      wrapper
        .find(Header)
        .at(0)
        .prop('date')
    ).toBe('2019/08/27 14:18:00 -0300');
  });
});
