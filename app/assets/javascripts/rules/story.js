export const iconRule = (story_type) => {
  switch (story_type) {
    case 'feature':
      return 'star';
    case 'bug':
      return 'bug_report';
    case 'chore':
      return 'settings'
    case 'release':
      return 'bookmark'
    default:
      return null
  }
};

export const classIconRule = (story_type) => {
  switch (story_type) {
    case 'feature':
      return 'star'
    case 'bug':
      return 'bug';
    case 'chore':
      return 'dark' ;
    case 'release':
      return 'release'
    default:
      return null
  }
};

export const isStoryDontEstimated = (story_type, estimate) => (story_type === 'feature' && !estimate);
export const IsRelease = (story_type) => (story_type === 'release');

export const IsShow = ({ logic, children }) => (
  logic ? children : null
);

export const estimateRule = (estimate) => estimate > 0 ? estimate : '-';

export const labelSplit = (labels) => labels.split(',')
