import Activity from 'models/activity';

describe('Activity', function () {
  let activity;

  beforeEach(function () {
    activity = new Activity({
      activity: {
        action: 'update',
        subject_type: 'Story',
        updated_at: '2017/02/01 11:02:10 -0200',
      },
    });
  });

  describe('initialize', function () {
    it('should format the date string', function () {
      expect(activity.attributes.date).toBe('1 Feb 2017');
    });
  });

  describe('humanActionName', function () {
    beforeEach(function () {
      vi.spyOn(I18n, 't').mockImplementation(arg => {
        if (arg === 'update') return 'updated';
      });
    });

    afterEach(function () {
      I18n.t.mockRestore();
    });

    it('returns the translated action name', function () {
      expect(activity.humanActionName('update')).toEqual('updated');
    });
  });
});
