import * as Task from 'actions/task';
import * as Story from 'actions/story';

describe('Task Actions', () => {
  describe('AddTask', () => {
    const task = { id: 1, name: 'test Task' };
    const projectId = 42;
    const story = { id: 420 };

    it('calls FakeTask.newTask with projectId, story and task', async () => {
      const FakeTask = {
        post: sinon.stub().resolves(task)
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Task.createTask(projectId, story.id, task)
        (fakeDispatch, null, { Task: FakeTask });

      expect(FakeTask.post).toHaveBeenCalledWith(projectId, story.id, task);
    });

    it('dispatch TaskAdd with story and task', async () => {
      const FakeTask = {
        post: sinon.stub().resolves(task)
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Task.createTask(projectId, story.id, task)
        (fakeDispatch, null, { Task: FakeTask });

      expect(fakeDispatch).toHaveBeenCalledWith(Task.createTaskSuccess(task, story.id));
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: "boom" };

      const FakeTask = {
        post: sinon.stub().rejects(error)
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Task.createTask(projectId, story.id, task)
        (fakeDispatch, null, { Task: FakeTask });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.storyFailure(story.id, error));
    });
  });

  describe('deleteTask', () => {
    const task = { id: 1, name: 'test Task' };
    const projectId = 42;
    const story = { id: 420 };

    it('calls FakeTask.destroy with projectId, story and task.id', async () => {
      const FakeTask = {
        destroy: sinon.stub().resolves({})
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Task.deleteTask(projectId, story.id, task.id)
        (fakeDispatch, null, { Task: FakeTask });

      expect(FakeTask.destroy).toHaveBeenCalledWith(projectId, story.id, task.id);
    });

    it('dispatch removeTask with story and task.id', async () => {
      const FakeTask = {
        destroy: sinon.stub().resolves(task)
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Task.deleteTask(projectId, story.id, task.id)
        (fakeDispatch, null, { Task: FakeTask });

      expect(fakeDispatch).toHaveBeenCalledWith(Task.deleteTaskSuccess(task.id, story.id));
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: "boom" };

      const FakeTask = {
        destroy: sinon.stub().rejects(error)
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Task.deleteTask(projectId, story.id, task)
        (fakeDispatch, null, { Task: FakeTask });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.storyFailure(story.id, error));
    });
  });

  describe('toggleTask', () => {
    const task = { id: 1, name: 'test Task', done: false };
    const status = true;
    const projectId = 42;
    const story = { id: 420 };

    it('calls FakeTask.toggle with projectId, story, task and status', async () => {
      const FakeTask = {
        toggle: sinon.stub().resolves(task)
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Task.toggleTask(projectId, story, task, status)
        (fakeDispatch, null, { Task: FakeTask });

      expect(FakeTask.toggle).toHaveBeenCalledWith(projectId, story.id, task.id, status);
    });

    it('dispatch toggleTaskSuccess with story and task', async () => {
      const FakeTask = {
        toggle: sinon.stub().resolves(task)
      };

      const fakeDispatch = sinon.stub().resolves({});

      await Task.toggleTask(projectId, story, task, status)
        (fakeDispatch, null, { Task: FakeTask });

      expect(fakeDispatch).toHaveBeenCalledWith(Task.toggleTaskSuccess(task, story));
    });
  });
});
