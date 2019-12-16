import * as History from 'models/beta/history';

describe('History', () => {
  describe("getDate", () => {
    const validDate = "2019/08/27 14:14:24 -0300";

    it("return a formated date", () => {
      const [ formatedDate ] = History.getDate(validDate, validDate);

      expect(formatedDate).toEqual(I18n.l("date.formats.long", validDate));
    });
  });
});
