import ProjectVelocityOverrideView from 'views/project_velocity_override_view';

describe('ProjectVelocityOverrideView', function() {
  let project;
  let subject;

  beforeEach(function() {
    project = {};
    ProjectVelocityOverrideView.prototype.template = sinon.stub();
    subject = new ProjectVelocityOverrideView({model: project});
  });

  describe("changeVelocity", function() {

    beforeEach(function() {
      sinon.stub(subject, 'requestedVelocityValue').returns(42);
      project.velocity = sinon.stub();
      subject.$el.remove = sinon.stub();
    });

    it("calls velocity() on the model", function() {
      subject.changeVelocity();
      expect(project.velocity).toHaveBeenCalledWith(42);
    });

    it("removes the $el", function() {
      subject.changeVelocity();
      expect(subject.$el.remove).toHaveBeenCalled();
    });

    it("returns false", function() {
      expect(subject.changeVelocity()).toEqual(false);
    });

  });

  describe("revertVelocity", function() {

    beforeEach(function() {
      project.revertVelocity = sinon.stub();
      subject.$el.remove = sinon.stub();
    });

    it("calls revertVelocity() on the model", function() {
      subject.revertVelocity();
      expect(project.revertVelocity).toHaveBeenCalled();
    });

    it("removes the $el", function() {
      subject.revertVelocity();
      expect(subject.$el.remove).toHaveBeenCalled();
    });

    it("returns false", function() {
      expect(subject.revertVelocity()).toEqual(false);
    });

  });

  describe("requestedVelocityValue", function() {

    beforeEach(function() {
      subject.$el.append('<input name="override" value="42">');
    });

    it("returns the right value", function() {
      expect(subject.requestedVelocityValue()).toEqual(42);
    });

  });
});
