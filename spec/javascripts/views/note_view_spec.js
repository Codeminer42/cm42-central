const NoteView = require('views/note_view');

describe('NoteView', () => {
  beforeEach(function () {
    const Note = Backbone.Model.extend({ name: 'note', url: '/foo' });
    this.note = new Note({});
    NoteView.prototype.template = sinon.stub();
    this.view = new NoteView({ model: this.note });
  });

  it('has div as the tag name', function () {
    expect(this.view.el.nodeName).toEqual('DIV');
  });

  it('has the note class', function () {
    expect($(this.view.el)).toHaveClass('note');
  });

  describe('deleteNote', () => {
    it('should call destroy on the model', function () {
      const deleteStub = sinon.stub(this.view.model, 'destroy');
      this.view.deleteNote();
      expect(deleteStub).toHaveBeenCalled();
    });

    it('should remove element', function () {
      const removeSpy = sinon.spy(this.view.$el, 'remove');
      this.view.deleteNote();
      expect(removeSpy).toHaveBeenCalled();
    });
  });
});
