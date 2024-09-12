import FormView from 'views/form_view';

describe('FormView', function () {
  let view;

  beforeEach(function () {
    FormView.prototype.template = vi.fn();
    view = new FormView();
  });

  it('should have a form as its top level element', function () {
    expect(view.el.nodeName).toEqual('FORM');
  });

  describe('mergeAttrs', function () {
    it('merges an options hash with some defaults', function () {
      var opts = { foo: 'bar' };
      var defaults = { foo: 'baz', bar: 'baz' };
      expect(view.mergeAttrs(defaults, opts)).toEqual({
        foo: 'bar',
        bar: 'baz',
      });
      expect(defaults).toEqual({ foo: 'bar', bar: 'baz' });
    });
  });
});
