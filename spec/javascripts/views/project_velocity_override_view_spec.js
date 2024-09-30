import ProjectVelocityOverrideView from 'views/project_velocity_override_view';

describe('ProjectVelocityOverrideView', function () {
  let project;
  let subject;

  beforeEach(function () {
    project = {};
    ProjectVelocityOverrideView.prototype.template = vi.fn();
    subject = new ProjectVelocityOverrideView({ model: project });
  });

  describe('changeVelocity', function () {
    beforeEach(function () {
      vi.spyOn(subject, 'requestedVelocityValue').mockReturnValueOnce(42);
      project.velocity = vi.fn();
      subject.$el.remove = vi.fn();
    });

    it('calls velocity() on the model', function () {
      subject.changeVelocity();
      expect(project.velocity).toHaveBeenCalledWith(42);
    });

    it('removes the $el', function () {
      subject.changeVelocity();
      expect(subject.$el.remove).toHaveBeenCalled();
    });

    it('returns false', function () {
      expect(subject.changeVelocity()).toEqual(false);
    });
  });

  describe('revertVelocity', function () {
    beforeEach(function () {
      project.revertVelocity = vi.fn();
      subject.$el.remove = vi.fn();
    });

    it('calls revertVelocity() on the model', function () {
      subject.revertVelocity();
      expect(project.revertVelocity).toHaveBeenCalled();
    });

    it('removes the $el', function () {
      subject.revertVelocity();
      expect(subject.$el.remove).toHaveBeenCalled();
    });

    it('returns false', function () {
      expect(subject.revertVelocity()).toEqual(false);
    });
  });

  describe('requestedVelocityValue', function () {
    beforeEach(function () {
      subject.$el.append('<input name="override" value="42">');
    });

    it('returns the right value', function () {
      expect(subject.requestedVelocityValue()).toEqual(42);
    });
  });
});
