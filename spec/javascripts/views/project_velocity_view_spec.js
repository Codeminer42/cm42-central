/* eslint import/no-webpack-loader-syntax:"off" */
const ProjectVelocityViewInjector = require('inject-loader!views/project_velocity_view');

describe('ProjectVelocityView', () => {
  beforeEach(function () {
    this.model = {};
    const overrideView = this.overrideView = {};

    function ProjectVelocityOverrideViewStub() {
      return overrideView;
    }

    ProjectVelocityOverrideViewStub.prototype.template = sinon.stub();

    const ProjectVelocityView = ProjectVelocityViewInjector({
      './project_velocity_override_view': ProjectVelocityOverrideViewStub,
    });

    sinon.stub(ProjectVelocityView.prototype, 'listenTo');

    this.subject = new ProjectVelocityView({ model: this.model });
  });

  it('should have a top level element', function () {
    expect(this.subject.el.nodeName).toEqual('DIV');
  });

  describe('initialize', () => {
    it('creates the override view', function () {
      expect(this.subject.override_view).toEqual(this.overrideView);
    });

    it('binds setFakeClass to change:userVelocity on the model', function () {
      expect(this.subject.listenTo).toHaveBeenCalledWith(this.subject.model, 'change:userVelocity', this.subject.setFakeClass);
    });

    it('binds render to rebuilt-iterations on the model', function () {
      expect(this.subject.listenTo).toHaveBeenCalledWith(this.subject.model, 'rebuilt-iterations', this.subject.render);
    });
  });

  describe('render', () => {
    beforeEach(function () {
      this.subject.$el.html = sinon.stub();
      this.subject.setFakeClass = sinon.stub();
      this.template = {};
      this.subject.template = sinon.stub().withArgs({ project: this.model }).returns(this.template);
    });

    it('renders the template', function () {
      this.subject.render();
      expect(this.subject.$el.html).toHaveBeenCalledWith(this.template);
    });

    it('calls setFakeClass()', function () {
      this.subject.render();
      expect(this.subject.setFakeClass).toHaveBeenCalledWith(this.model);
    });

    it('returns itself', function () {
      expect(this.subject.render()).toBe(this.subject);
    });
  });

  describe('editVelocityOverride', () => {
    beforeEach(function () {
      this.el = {};
      this.subject.override_view.render = sinon.stub();
      this.subject.override_view.render.returns({ el: this.el });
      this.subject.$el.append = sinon.stub();
    });

    it('appends the override view to its $el', function () {
      this.subject.editVelocityOverride();
      expect(this.subject.$el.append).toHaveBeenCalled(this.el);
    });
  });

  describe('setFakeClass', () => {
    beforeEach(function () {
      this.model.velocityIsFake = sinon.stub();
    });

    describe('when velocity is fake', () => {
      beforeEach(function () {
        this.model.velocityIsFake.returns(true);
      });

      it('adds the fake class to $el', function () {
        this.subject.setFakeClass(this.model);
        expect(this.subject.$el).toHaveClass('fake');
      });
    });

    describe('when velocity is not fake', () => {
      beforeEach(function () {
        this.model.velocityIsFake.returns(false);
      });

      it('adds the fake class to $el', function () {
        this.subject.setFakeClass(this.model);
        expect(this.subject.$el).not.toHaveClass('fake');
      });
    });
  });
});
