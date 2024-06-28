export const historyStatus = {
  DISABLED: 'DISABLED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  FAILED: 'FAILED',
};

export const status = {
  ACCEPTED: 'accepted',
  DELIVERED: 'delivered',
  STARTED: 'started',
  REJECTED: 'rejected',
  FINISHED: 'finished',
  UNSTARTED: 'unstarted',
  UNSCHEDULED: 'unscheduled',
  RELEASE: 'release',
};

export const storyTypes = {
  BUG: 'bug',
  CHORE: 'chore',
  FEATURE: 'feature',
  RELEASE: 'release',
};

export const storyScopes = {
  ALL: 'all',
  SEARCH: 'search',
  EPIC: 'epic',
};

export const operands = {
  requester: 'requested_by_name',
  owner: 'owned_by_name',
  initials: 'owned_by_initials',
  type: 'story_type',
  state: 'state',
};

export const columns = {
  CHILLY_BIN: 'chillyBin',
  DONE: 'done',
  BACKLOG: 'backlog',
  EPIC: 'epic',
  SEARCH: 'search',
};
