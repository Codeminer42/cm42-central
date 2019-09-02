import React from "react";
import { shallow, mount } from "enzyme";
import History, {
  Changes,
  Header,
  getDate
} from "../../../../app/assets/javascripts/components/stories/History";
import HistoryFactory from "../../support/factories/historyFactory";

describe("<History />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<History history={HistoryFactory()} />);
  });

  it("Should render a History", () => {
    expect(wrapper.find(".history-activity")).toExist();
  });

  it("Should render a list of Changes", () => {
    expect(wrapper.find(Changes)).toExist();
    expect(
      Object.keys(
        wrapper
          .find(Changes)
          .at(0)
          .prop("changes")
      ).length
    ).toBe(6);
  });

  it("Should render a Header", () => {
    expect(wrapper.find(Header)).toExist();
    expect(wrapper.find(Header).length).toBe(2);
    expect(
      wrapper
        .find(Header)
        .at(1)
        .prop("title")
    ).toBe(I18n.t(`activity.actions.create`));
    expect(
      wrapper
        .find(Header)
        .at(1)
        .prop("date")
    ).toBe("2019/08/27 14:18:00 -0300");
  });

  describe("getDate", () => {
    it("Should return a formated date", () => {
      const key = "updated_at";
      const changes = {
        updated_at: ["2019/08/27 14:14:24 -0300", "2019/08/27 14:19:25 -0300"]
      };
      expect(getDate(key, changes)[0]).toEqual(
        I18n.l("date.formats.long", changes.updated_at[0])
      );
      expect(getDate(key, changes)[1]).toEqual(
        I18n.l("date.formats.long", changes.updated_at[1])
      );
    });

    it("Should return null", () => {
      const key = "updated_at";
      const changes = {
        updated_at: [null, null]
      };
      expect(getDate(key, changes)[0]).toEqual(null);
      expect(getDate(key, changes)[1]).toEqual(null);
    });

    it("Should return just the changes", () => {
      const key = "state";
      const changes = {
        state: ["finished", "delivered"]
      };
      expect(getDate(key, changes)[0]).toEqual("finished");
      expect(getDate(key, changes)[1]).toEqual("delivered");
    });
  });
});
