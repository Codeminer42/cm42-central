const historyFactory = () => [
  {
    activity: {
      id: 1,
      project_id: 1,
      user_id: 1,
      subject_id: 69,
      subject_type: 'Story',
      action: 'create',
      subject_changes: {},
      subject_destroyed_type: null,
      created_at: '2019/08/27 14:18:00 -0300',
      updated_at: '2019/08/27 14:18:00 -0300',
      user: 'user',
      changes: []
    }
  },
  {
    activity: {
      id: 2,
      project_id: 1,
      user_id: 1,
      subject_id: 69,
      subject_type: 'Story',
      action: 'update',
      subject_changes: {
        state: ['unscheduled', 'started'],
        owned_by_id: [null, '1'],
        started_at: [null, '2019/08/27 14:18:09 -0300'],
        owned_by_name: [null, 'Foo Bar'],
        owned_by_initials: [null, 'FB'],
        updated_at: ['2019/08/27 14:18:00 -0300', '2019/08/27 14:18:09 -0300']
      },
      subject_destroyed_type: null,
      created_at: '2019/08/27 14:18:10 -0300',
      updated_at: '2019/08/27 14:18:10 -0300',
      user: 'user',
      changes: []
    }
  }
];

export default historyFactory;
