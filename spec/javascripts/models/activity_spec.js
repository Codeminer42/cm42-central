import Activity from 'models/activity';

describe("Activity", function() {

  beforeEach(function() {
    this.activity = new Activity({
      activity: {
        action: 'update',
        subject_type: 'Story',
        updated_at: '2017/02/01 11:02:10 -0200'
      }
    });
  });

  describe('initialize', function() {

    it('should format the date string', function(){
      expect(this.activity.attributes.date).toBe('1 Feb 2017');
    });

  });

  describe('humanActionName', function() {

    beforeEach(function() {
      sinon.stub(I18n, 't');
      I18n.t.withArgs('update').returns('updated');
    });

    afterEach(function() {
      I18n.t.restore();
    });

    it("returns the translated action name", function() {
      expect(this.activity.humanActionName('update')).toEqual('updated');
    });

  });

});
