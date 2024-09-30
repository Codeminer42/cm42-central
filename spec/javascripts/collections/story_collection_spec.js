import Story from 'models/story';
import StoryCollection from 'collections/story_collection';

describe('StoryCollection', function () {
  let story1;
  let story2;
  let story3;
  let stories;

  beforeEach(function () {
    story1 = new Story({ id: 1, title: 'Story 1', position: '10.0' });
    story2 = new Story({ id: 2, title: 'Story 2', position: '20.0' });
    story3 = new Story({ id: 3, title: 'Story 3', position: '30.0' });
    story1.labels =
      story2.labels =
      story3.labels =
        function () {
          return [];
        };

    stories = new StoryCollection();
    stories.url = '/foo';
    stories.add([story3, story2, story1]);
  });

  describe('position', function () {
    it('should return stories in position order', function () {
      expect(stories.at(0)).toBe(story1);
      expect(stories.at(1)).toBe(story2);
      expect(stories.at(2)).toBe(story3);
    });

    it('should move between 2 other stories', function () {
      expect(stories.at(2)).toBe(story3);

      story3.moveBetween(1, 2);
      expect(story3.position()).toEqual(15.0);
      expect(stories.at(1).id).toEqual(story3.id);
    });

    it('should move after another story', function () {
      expect(stories.at(2)).toBe(story3);

      story3.moveAfter(1);
      expect(story3.position()).toEqual(15.0);
      expect(stories.at(1).id).toEqual(story3.id);
    });

    it('should move after the last story', function () {
      expect(stories.at(2)).toBe(story3);
      story1.moveAfter(3);
      expect(story1.position()).toEqual(31.0);
      expect(stories.at(2).id).toEqual(story1.id);
    });

    it('should move before the first story', function () {
      expect(stories.at(0)).toBe(story1);
      story3.moveBefore(1);
      expect(story3.position()).toEqual(5.0);
      expect(stories.at(0).id).toEqual(story3.id);
    });

    it('should move before another story', function () {
      expect(stories.at(2)).toBe(story3);

      story3.moveBefore(2);
      expect(story3.position()).toEqual(15.0);
      expect(stories.at(1).id).toEqual(story3.id);
    });

    it('should return the story after a given story', function () {
      expect(stories.next(story1)).toBe(story2);

      // Should return undefined if there is no next story
      expect(stories.next(story3)).toBeUndefined();
    });

    it('should return the story before a given story', function () {
      expect(stories.previous(story3)).toBe(story2);

      // Should return undefined if there is no previous story
      expect(stories.previous(story1)).toBeUndefined();
    });

    it('should reset whenever a models position attr changes', function () {
      var spy = vi.fn();
      stories.on('reset', spy);
      story1.set({ position: 0.5 });
      expect(spy).toHaveBeenCalled();
    });

    it('should reset whenever a models state changes', function () {
      var spy = vi.fn();
      stories.on('reset', spy);
      story1.set({ state: 'unstarted' });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('position on columns', function () {
    beforeEach(function () {
      stories.at(0).column = '#backlog';
      stories.at(1).column = '#backlog';
      stories.at(2).column = '#done';
    });

    it('should return the story before a given story in a given column', function () {
      expect(stories.previousOnColumn(story2)).toBe(story1);
    });

    it('should return the story after a given story in a given column', function () {
      expect(stories.nextOnColumn(story1)).toBe(story2);
    });

    it('should return undefined when there is no next or previous story in a given column', function () {
      expect(stories.nextOnColumn(story2)).toBeUndefined();
      expect(stories.previousOnColumn(story1)).toBeUndefined();
      expect(stories.previousOnColumn(story3)).toBeUndefined();
    });
  });

  describe('columns', function () {
    it('should return all stories in the done column', function () {
      expect(stories.column('#done')).toEqual([]);
      story1.column = '#done';
      expect(stories.column('#done')).toEqual([story1]);
    });

    it('returns a set of columns', function () {
      story1.column = '#done';
      story2.column = '#current';
      story3.column = '#backlog';
      expect(stories.columns(['#backlog', '#current', '#done'])).toEqual([
        story3,
        story2,
        story1,
      ]);
    });
  });

  describe('labels', function () {
    it('should initialize with an empty labels list', function () {
      expect(stories.labels).toEqual([]);
    });

    it('should add labels to the list', function () {
      expect(stories.addLabels(['foo', 'bar', 'baz'])).toEqual([
        'foo',
        'bar',
        'baz',
      ]);
      expect(stories.labels).toEqual(['foo', 'bar', 'baz']);

      // Should add to the array
      expect(stories.addLabels(['boo'])).toEqual(['foo', 'bar', 'baz', 'boo']);
      expect(stories.labels).toEqual(['foo', 'bar', 'baz', 'boo']);

      // Should add to the array, ignoring duplicates
      expect(stories.addLabels(['foo', 'bun'])).toEqual([
        'foo',
        'bar',
        'baz',
        'boo',
        'bun',
      ]);
      expect(stories.labels).toEqual(['foo', 'bar', 'baz', 'boo', 'bun']);
    });

    it('should add labels when adding a story', function () {
      var Story = Backbone.Model.extend({
        name: 'story',
        labels: vi.fn(),
        position: function () {
          return 1;
        },
      });
      var story = new Story({});
      story.labels.mockReturnValueOnce(['dummy', 'labels']);
      expect(stories.labels).toEqual([]);
      stories.add(story);
      expect(stories.labels).toEqual(['dummy', 'labels']);
    });
  });
});
