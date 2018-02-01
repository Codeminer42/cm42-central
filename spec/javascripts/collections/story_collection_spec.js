var Story = require('models/story');
var StoryCollection = require('collections/story_collection');
describe('StoryCollection', function() {

  beforeEach(function() {
    this.story1 = new Story({id: 1, title: "Story 1", position: '10.0'});
    this.story2 = new Story({id: 2, title: "Story 2", position: '20.0'});
    this.story3 = new Story({id: 3, title: "Story 3", position: '30.0'});
    this.story1.labels = this.story2.labels = this.story3.labels = function() { return []; };

    this.stories = new StoryCollection();
    this.stories.url = '/foo';
    this.stories.add([this.story3, this.story2, this.story1]);
  });

  describe('position', function() {

    it('should return stories in position order', function() {
      expect(this.stories.at(0)).toBe(this.story1);
      expect(this.stories.at(1)).toBe(this.story2);
      expect(this.stories.at(2)).toBe(this.story3);
    });

    it('should move after another story', function() {

      expect(this.stories.at(2)).toBe(this.story3);

      this.story3.move(1);
      expect(this.story3.position()).toEqual(15.0);
      expect(this.stories.at(1).id).toEqual(this.story3.id);
    });

    it('should move after the last story', function() {
      expect(this.stories.at(2)).toBe(this.story3);
      this.story1.move(3);
      expect(this.story1.position()).toEqual(31.0);
      expect(this.stories.at(2).id).toEqual(this.story1.id);
    });

    it('should move before the first story', function() {
      expect(this.stories.at(0)).toBe(this.story1);
      this.story3.move(undefined, 1);
      expect(this.story3.position()).toEqual(5.0);
      expect(this.stories.at(0).id).toEqual(this.story3.id);
    });

    it('should move before another story', function() {

      expect(this.stories.at(2)).toBe(this.story3);

      this.story3.move(undefined, 2);
      expect(this.story3.position()).toEqual(15.0);
      expect(this.stories.at(1).id).toEqual(this.story3.id);
    });

    it('should return the story after a given story', function() {
      expect(this.stories.next(this.story1)).toBe(this.story2);

      // Should return undefined if there is no next story
      expect(this.stories.next(this.story3)).toBeUndefined();
    });

    it('should return the story before a given story', function() {
      expect(this.stories.previous(this.story3)).toBe(this.story2);

      // Should return undefined if there is no previous story
      expect(this.stories.previous(this.story1)).toBeUndefined();
    });

    it("should reset whenever a models position attr changes", function() {
      var spy = sinon.spy();
      this.stories.on("reset", spy);
      this.story1.set({position: 0.5});
      expect(spy).toHaveBeenCalled();
    });

    it("should reset whenever a models state changes", function() {
      var spy = sinon.spy();
      this.stories.on("reset", spy);
      this.story1.set({state: 'unstarted'});
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('position on columns', function() {

    beforeEach(function() {
      this.stories.at(0).column = '#backlog';
      this.stories.at(1).column = '#backlog';
      this.stories.at(2).column = '#done';
    });

    it('should return the story before a given story in a given column', function() {
      expect(this.stories.previousOnColumn(this.story2)).toBe(this.story1);
    });

    it('should return the story after a given story in a given column', function() {
      expect(this.stories.nextOnColumn(this.story1)).toBe(this.story2);
    });

    it('should return undefined when there is no next or previous story in a given column',
      function() {
        expect(this.stories.nextOnColumn(this.story2)).toBeUndefined();
        expect(this.stories.previousOnColumn(this.story1)).toBeUndefined();
        expect(this.stories.previousOnColumn(this.story3)).toBeUndefined();
      }
    );

  });

  describe("columns", function() {

    it("should return all stories in the done column", function() {
      expect(this.stories.column('#done')).toEqual([]);
      this.story1.column = '#done';
      expect(this.stories.column('#done')).toEqual([this.story1]);
    });

    it("returns a set of columns", function() {
      this.story1.column = '#done';
      this.story2.column = '#current';
      this.story3.column = '#backlog';
      expect(this.stories.columns(['#backlog', '#current', '#done']))
        .toEqual([this.story3,this.story2,this.story1]);
    });

  });

  describe("story sorting", function() {
    beforeEach(function(){
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    describe("when the positions become to have too many decimal places", function() {
      beforeEach(function() {
        this.story1.set({position: 1});
        this.story2.set({position: 2.52654664795});
        this.story3.sortUpdate(this.story3.column, this.story1.id, this.story2.id);
      });

      it("should make a request sort the entire column", function() {
        const request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('/foo/sort');
        expect(request.method).toBe('PUT');
        expect(request.data()).toMatch(/[this.story1.id, this.story3.id, this.story2.id]/);
      });
    });;

    describe("when the new position is valid", function() {
      beforeEach(function() {
        this.story3.sortUpdate(this.story3.column, this.story1.id, this.story2.id);
      });

      it("should not make a request to sort the entire column", function() {
        expect(this.story3.position()).toEqual(15.0);
        const request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).not.toBe('foo/sort');
      });
    });
  });

  describe("labels", function() {

    it("should initialize with an empty labels list", function() {
      expect(this.stories.labels).toEqual([]);
    });

    it("should add labels to the list", function() {
      expect(this.stories.addLabels(["foo","bar","baz"])).toEqual(["foo","bar","baz"]);
      expect(this.stories.labels).toEqual(["foo","bar","baz"]);

      // Should add to the array
      expect(this.stories.addLabels(["boo"])).toEqual(["foo","bar","baz","boo"]);
      expect(this.stories.labels).toEqual(["foo","bar","baz","boo"]);

      // Should add to the array, ignoring duplicates
      expect(this.stories.addLabels(["foo", "bun"])).toEqual(["foo","bar","baz","boo","bun"]);
      expect(this.stories.labels).toEqual(["foo","bar","baz","boo","bun"]);
    });

    it("should add labels when adding a story", function() {
      var Story = Backbone.Model.extend({
        name: 'story',
        labels: sinon.stub(),
        position: function() { return 1; }
      });
      var story = new Story({});
      story.labels.returns(["dummy", "labels"]);
      expect(this.stories.labels).toEqual([]);
      this.stories.add(story);
      expect(this.stories.labels).toEqual(["dummy", "labels"]);
    });

  });
});
