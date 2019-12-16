import React from "react";
import { shallow } from "enzyme";
import History from "../../../../../app/assets/javascripts/components/stories/History/index";
import HistoryFactory from "../../../support/factories/historyFactory";

describe("<History />", () => {
  const render = () => {
    const wrapper = shallow(<History history={HistoryFactory()} />);
    const historyActivity = wrapper.find('[data-id="history-activity"]');

    return { wrapper, historyActivity }
  };

  it('renders the component', () => {
    const { wrapper } = render();

    expect(wrapper).toExist();
  });

  it("renders <historyActivity />", () => {
    const { historyActivity } = render();

    expect(historyActivity).toExist();
  });
});
