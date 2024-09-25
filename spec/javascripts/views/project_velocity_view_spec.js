import ProjectVelocityView from 'views/project_velocity_view';
import ProjectVelocityOverrideView from 'views/project_velocity_override_view';

vi.mock('views/project_velocity_override_view');

describe('ProjectVelocityView', function () {
  let model;
  let subject;
  let overrideView;
  let ProjectVelocityOverrideViewStub;

  beforeEach(function () {
    model = {};

    overrideView = {};

    vi.spyOn(ProjectVelocityOverrideView.prototype, 'template').mockImplementation(() => {});

    ProjectVelocityOverrideViewStub = () => overrideView;

    ProjectVelocityOverrideView.mockImplementation(
      () => ProjectVelocityOverrideViewStub
    );

    vi.spyOn(ProjectVelocityView.prototype, 'listenTo').mockImplementation(() => {});

    subject = new ProjectVelocityView({ model });
  });

  it('should have a top level element', function () {
    expect(subject.el.nodeName).toEqual('DIV');
  });

  describe('initialize', function () {
    it('creates the override view', function () {
      expect(subject.override_view).toEqual(ProjectVelocityOverrideViewStub);
    });

    it('binds setFakeClass to change:userVelocity on the model', function () {
      expect(subject.listenTo).toHaveBeenCalledWith(
        subject.model,
        'change:userVelocity',
        subject.setFakeClass
      );
    });

    it('binds render to rebuilt-iterations on the model', function () {
      expect(subject.listenTo).toHaveBeenCalledWith(
        subject.model,
        'rebuilt-iterations',
        subject.render
      );
    });
  });

  describe('render', function () {
    let template;

    beforeEach(function () {
      subject.$el.html = vi.fn();
      subject.setFakeClass = vi.fn();
      template = {};
      subject.template = vi.fn().mockImplementation(arg => {
        const object = { project: model };

        if (JSON.stringify(arg) == JSON.stringify(object)) return template;
      });
    });

    it('renders the template', function () {
      subject.render();
      expect(subject.$el.html).toHaveBeenCalledWith(template);
    });

    it('calls setFakeClass()', function () {
      subject.render();
      expect(subject.setFakeClass).toHaveBeenCalledWith(model);
    });

    it('returns itself', function () {
      expect(subject.render()).toBe(subject);
    });
  });

  describe('editVelocityOverride', function () {
    let el;

    beforeEach(function () {
      el = {};
      subject.override_view.render = vi.fn();
      subject.override_view.render.mockReturnValueOnce({ el: el });
      subject.$el.append = vi.fn();
    });

    it('appends the override view to its $el', function () {
      subject.editVelocityOverride();
      expect(subject.$el.append).toHaveBeenCalled(el);
    });
  });

  describe('setFakeClass', function () {
    beforeEach(function () {
      model.velocityIsFake = vi.fn();
    });

    describe('when velocity is fake', function () {
      beforeEach(function () {
        model.velocityIsFake.mockReturnValueOnce(true);
      });

      it('adds the fake class to $el', function () {
        subject.setFakeClass(model);
        expect(subject.$el[0]).toHaveClass('fake');
      });
    });

    describe('when velocity is not fake', function () {
      beforeEach(function () {
        model.velocityIsFake.mockReturnValueOnce(false);
      });

      it('adds the fake class to $el', function () {
        subject.setFakeClass(model);
        expect(subject.$el[0]).not.toHaveClass('fake');
      });
    });
  });
});
