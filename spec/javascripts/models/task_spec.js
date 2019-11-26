import Task from 'models/task';

describe("Task", function() {
  let task;

  beforeEach(function() {
    task = new Task({});
  });

  describe("story", function() {

    beforeEach(function() {
      task.set({story_id: 999, name: 'Foobar'});
    });

    it("returns the name task", function() {
      expect(task.get('name')).toEqual('Foobar');
    });

    it("returns the story_id", function() {
      expect(task.get('story_id')).toEqual(999);
    });

  });

  describe("errors", function() {

    it("should record errors", function() {
      expect(task.hasErrors()).toBeFalsy();
      expect(task.errorsOn('name')).toBeFalsy();

      task.set({errors: {
        name: ["cannot be blank", "needs to be better"]
      }});

      expect(task.hasErrors()).toBeTruthy();
      expect(task.errorsOn('name')).toBeTruthy();

      expect(task.errorMessages())
        .toEqual("name cannot be blank, name needs to be better");
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
      expect(task.humanAttributeName('foo_bar')).toEqual('Foo bar');
    });

    it("strips of the id suffix", function() {
      expect(task.humanAttributeName('foo_bar_id')).toEqual('Foo bar');
    });
  });
});
