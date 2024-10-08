import Task from 'models/task';
import { afterEach } from 'vitest';

describe('Task', function () {
  let task;

  beforeEach(function () {
    task = new Task({});
  });

  describe('story', function () {
    beforeEach(function () {
      task.set({ story_id: 999, name: 'Foobar' });
    });

    it('returns the name task', function () {
      expect(task.get('name')).toEqual('Foobar');
    });

    it('returns the story_id', function () {
      expect(task.get('story_id')).toEqual(999);
    });
  });

  describe('errors', function () {
    it('should record errors', function () {
      expect(task.hasErrors()).toBeFalsy();
      expect(task.errorsOn('name')).toBeFalsy();

      task.set({
        errors: {
          name: ['cannot be blank', 'needs to be better'],
        },
      });

      expect(task.hasErrors()).toBeTruthy();
      expect(task.errorsOn('name')).toBeTruthy();

      expect(task.errorMessages()).toEqual(
        'name cannot be blank, name needs to be better'
      );
    });
  });

  describe('humanAttributeName', function () {
    beforeEach(function () {
      vi.spyOn(I18n, 't').mockImplementation(arg => {
        if (arg === 'foo_bar') return 'Foo bar';
      });
    });

    afterEach(() => {
      I18n.t.mockRestore();
    });

    it('returns the translated attribute name', function () {
      expect(task.humanAttributeName('foo_bar')).toEqual('Foo bar');
    });

    it('strips of the id suffix', function () {
      expect(task.humanAttributeName('foo_bar_id')).toEqual('Foo bar');
    });
  });
});
