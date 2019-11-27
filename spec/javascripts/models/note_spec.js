import Note from 'models/note';

describe("Note", function() {
  let note;

  beforeEach(function() {
    note = new Note({});
  });

  describe("user", function() {
    let project;
    let usersCollectionStub;

    beforeEach(function() {
      project = {users: {get: usersCollectionStub}};
      note.set({user_id: 999, user_name: 'John Doe'});
      note.collection = {story: {collection: {project: project}}};
    });

    it("returns the name of the user", function() {
      expect(note.get('user_name')).toEqual('John Doe');
    });

  });

  describe("errors", function() {

    it("should record errors", function() {
      expect(note.hasErrors()).toBeFalsy();
      expect(note.errorsOn('note')).toBeFalsy();

      note.set({errors: {
        note: ["cannot be blank", "needs to be better"]
      }});

      expect(note.hasErrors()).toBeTruthy();
      expect(note.errorsOn('note')).toBeTruthy();

      expect(note.errorMessages())
        .toEqual("note cannot be blank, note needs to be better");
    });

  });

  describe('humanAttributeName', function() {

    beforeEach(function() {
      sinon.stub(I18n, 't');
      I18n.t.withArgs('foo_bar').returns('Foo bar');
    });

    afterEach(function() {
      I18n.t.restore();
    });

    it("returns the translated attribute name", function() {
      expect(note.humanAttributeName('foo_bar')).toEqual('Foo bar');
    });

    it("strips of the id suffix", function() {
      expect(note.humanAttributeName('foo_bar_id')).toEqual('Foo bar');
    });
  });
});
