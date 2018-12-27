import * as Task from 'actions/task';

describe('Task Actions', () => {
  describe('AddTask', () => {
    const task = {id: 1,name: 'test Task' };
    const projectId = 42;
    const story = { id: 420 };

    it('calls FakeTask.newTask with projectId, story and task', (done) => {
      const FakeTask = {
        post: sinon.stub().resolves(task)
      };

      const fakeDispatch = sinon.stub().resolves({});

      Task.createTask(projectId, story.id, task)(fakeDispatch, null, { Task: FakeTask })
        .then(() => {
          expect(FakeTask.post).toHaveBeenCalledWith(projectId, story.id, task);

          done();
        });
    });

    it('dispatch TaskAdd with story and task', (done) => {
      const FakeTask = {
        post: sinon.stub().resolves(task)
      };

      const fakeDispatch = sinon.stub().resolves({});

      Task.createTask(projectId, story.id, task)(fakeDispatch, null, { Task: FakeTask })
        .then(() => {
          expect(fakeDispatch).toHaveBeenCalledWith(Task.createTaskSuccess(task, story.id));

          done();
        });
    });
  });

  describe('deleteTask', () => {
    const task = { id: 1, name: 'test Task' };
    const projectId = 42;
    const story = { id: 420 } ;

    it('calls FakeTask.destroy with projectId, story and task.id', (done) => {
      const FakeTask = {
        destroy: sinon.stub().resolves({})
      };

      const fakeDispatch = sinon.stub().resolves({});

      Task.deleteTask(projectId, story.id, task.id)(fakeDispatch, null, { Task: FakeTask })
        .then(() => {
          expect(FakeTask.destroy).toHaveBeenCalledWith(projectId, story.id, task.id);

          done();
        });
    });

    it('dispatch removeTask with story and task.id', (done) => {
      const FakeTask = {
        destroy: sinon.stub().resolves(task)
      };

      const fakeDispatch = sinon.stub().resolves({});

      Task.deleteTask(projectId, story.id, task.id)(fakeDispatch, null, { Task: FakeTask })
        .then(() => {
          expect(fakeDispatch).toHaveBeenCalledWith(Task.deleteTaskSuccess(task.id, story.id));

          done();
        });
    });
  });

  describe('toggleTask', () => {
    const task = { id: 1, name: 'test Task', done: false };
    const status = true;
    const projectId = 42;
    const story = { id: 420 };

    it('calls FakeTask.toggle with projectId, story, task and status', (done) => {
      const FakeTask = {
        toggle: sinon.stub().resolves(task)
      };

      const fakeDispatch = sinon.stub().resolves({});

      Task.toggleTask(projectId, story, task, status)(fakeDispatch, null, { Task: FakeTask })
        .then(() => {
          expect(FakeTask.toggle).toHaveBeenCalledWith(projectId, story.id, task.id, status);

          done();
        });
    });

    it('dispatch toggleTaskSuccess with story and task', (done) => {
      const FakeTask = {
        toggle: sinon.stub().resolves(task)
      };

      const fakeDispatch = sinon.stub().resolves({});

      Task.toggleTask(projectId, story, task, status)(fakeDispatch, null, { Task: FakeTask })
        .then(() => {
          expect(fakeDispatch).toHaveBeenCalledWith(Task.toggleTaskSuccess(task, story));

          done();
        });
    });
  });
});
