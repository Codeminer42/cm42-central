import * as Task from 'actions/task';
import * as Story from 'actions/story';

describe('Task Actions', () => {
  describe('AddTask', () => {
    const task = { id: 1, name: 'test Task' };
    const projectId = 42;
    const story = { id: 420 };

    it('calls FakeTask.newTask with projectId, story and task', async () => {
      const FakeTask = {
        post: vi.fn().mockResolvedValue(task),
      };

      const fakeDispatch = vi.fn().mockResolvedValue({});

      await Task.createTask(projectId, story.id, task)(fakeDispatch, null, {
        Task: FakeTask,
      });

      expect(FakeTask.post).toHaveBeenCalledWith(projectId, story.id, task);
    });

    it('dispatch TaskAdd with story and task', async () => {
      const FakeTask = {
        post: vi.fn().mockResolvedValueOnce(task),
      };

      const fakeDispatch = vi.fn().mockResolvedValueOnce({});

      await Task.createTask(projectId, story.id, task)(fakeDispatch, null, {
        Task: FakeTask,
      });

      expect(fakeDispatch).toHaveBeenCalledWith(
        Task.createTaskSuccess(task, story.id)
      );
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: 'boom' };

      const FakeTask = {
        post: vi.fn().mockRejectedValueOnce(error),
      };

      const fakeDispatch = vi.fn().mockResolvedValueOnce({});

      await Task.createTask(projectId, story.id, task)(fakeDispatch, null, {
        Task: FakeTask,
      });

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.storyFailure(story.id, error)
      );
    });
  });

  describe('deleteTask', () => {
    const task = { id: 1, name: 'test Task' };
    const projectId = 42;
    const story = { id: 420 };

    it('calls FakeTask.destroy with projectId, story and task.id', async () => {
      const FakeTask = {
        destroy: vi.fn().mockRejectedValueOnce({}),
      };

      const fakeDispatch = vi.fn().mockRejectedValueOnce({});

      await Task.deleteTask(projectId, story.id, task.id)(fakeDispatch, null, {
        Task: FakeTask,
      });

      expect(FakeTask.destroy).toHaveBeenCalledWith(
        projectId,
        story.id,
        task.id
      );
    });

    it('dispatch removeTask with story and task.id', async () => {
      const FakeTask = {
        destroy: vi.fn().mockResolvedValueOnce(task),
      };

      const fakeDispatch = vi.fn().mockResolvedValueOnce({});

      await Task.deleteTask(projectId, story.id, task.id)(fakeDispatch, null, {
        Task: FakeTask,
      });

      expect(fakeDispatch).toHaveBeenCalledWith(
        Task.deleteTaskSuccess(task.id, story.id)
      );
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: 'boom' };

      const FakeTask = {
        destroy: vi.fn().mockRejectedValueOnce(error),
      };

      const fakeDispatch = vi.fn().mockResolvedValue({});

      await Task.deleteTask(projectId, story.id, task)(fakeDispatch, null, {
        Task: FakeTask,
      });

      expect(fakeDispatch).toHaveBeenCalledWith(
        Story.storyFailure(story.id, error)
      );
    });
  });

  describe('toggleTask', () => {
    const task = { id: 1, name: 'test Task', done: false };
    const status = true;
    const projectId = 42;
    const story = { id: 420 };

    it('calls FakeTask.toggle with projectId, story, task and status', async () => {
      const FakeTask = {
        toggle: vi.fn().mockResolvedValue(task),
      };

      const fakeDispatch = vi.fn().mockResolvedValue({});

      await Task.toggleTask(
        projectId,
        story,
        task,
        status
      )(fakeDispatch, null, { Task: FakeTask });

      expect(FakeTask.toggle).toHaveBeenCalledWith(
        projectId,
        story.id,
        task.id,
        status
      );
    });

    it('dispatch toggleTaskSuccess with story and task', async () => {
      const FakeTask = {
        toggle: vi.fn().mockResolvedValue(task),
      };

      const fakeDispatch = vi.fn().mockResolvedValue({});

      await Task.toggleTask(
        projectId,
        story,
        task,
        status
      )(fakeDispatch, null, { Task: FakeTask });

      expect(fakeDispatch).toHaveBeenCalledWith(
        Task.toggleTaskSuccess(task, story)
      );
    });
  });
});
