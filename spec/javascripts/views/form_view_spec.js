const FormView = require('views/form_view');

describe('FormView', () => {
  beforeEach(function () {
    FormView.prototype.template = sinon.stub();
    this.view = new FormView();
  });

  it('should have a form as its top level element', function () {
    expect(this.view.el.nodeName).toEqual('FORM');
  });

  describe('mergeAttrs', () => {
    it('merges an options hash with some defaults', function () {
      const opts = { foo: 'bar' };
      const defaults = { foo: 'baz', bar: 'baz' };
      expect(this.view.mergeAttrs(defaults, opts)).toEqual({ foo: 'bar', bar: 'baz' });
      expect(defaults).toEqual({ foo: 'bar', bar: 'baz' });
    });
  });
});
