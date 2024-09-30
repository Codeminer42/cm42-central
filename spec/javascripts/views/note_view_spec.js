import NoteView from 'views/note_view';

describe('NoteView', function () {
  let note;
  let view;

  beforeEach(function () {
    var Note = Backbone.Model.extend({ name: 'note', url: '/foo' });
    note = new Note({});
    NoteView.prototype.template = vi.fn();
    view = new NoteView({ model: note });
  });

  it('has div as the tag name', function () {
    expect(view.el.nodeName).toEqual('DIV');
  });

  it('has the note class', function () {
    expect(view.$el[0]).toHaveClass('note');
  });

  describe('deleteNote', function () {
    it('should call destroy on the model', function () {
      var deleteStub = vi.spyOn(view.model, 'destroy');
      view.deleteNote();
      expect(deleteStub).toHaveBeenCalled();
    });

    it('should remove element', function () {
      var removeSpy = vi.spyOn(view.$el, 'remove');
      view.deleteNote();
      expect(removeSpy).toHaveBeenCalled();
    });
  });
});
