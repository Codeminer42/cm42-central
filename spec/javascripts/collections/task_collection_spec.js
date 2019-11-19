import TaskCollection from 'collections/task_collection';

describe('TaskCollection', function() {
  let story;
  let task_collection;

  beforeEach(function() {
    var Story = Backbone.Model.extend({name: 'story'});
    story = new Story({url: '/foo'});
    story.url = function() { return '/foo'; };

    task_collection = new TaskCollection();
    task_collection.story = story;
  });

  describe("url", function() {

    it("should return the url", function() {
      expect(task_collection.url()).toEqual('/foo/tasks');
    });

  });

  it("should return only saved tasks", function() {
    task_collection.add({id: 1, name: "Saved task"});
    task_collection.add({name: "Unsaved task"});
    expect(task_collection.length).toEqual(2);
    expect(task_collection.saved().length).toEqual(1);
  });

});
