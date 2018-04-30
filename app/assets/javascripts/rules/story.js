const iconRules = {
  feature: { icon: 'start', className: 'star' },
  bug: { icon: 'bug_report', className: 'bug' },
  chore: { icon: 'settings', className: 'dark' },
  release: { icon: 'bookmark', className: 'bookmark' }
};

const iconRuleFor = (storyType, ruleType) => (
  iconRules[storyType]
  ? iconRules[storyType][ruleType]
  : null
);

export const iconRule = (storyType) => iconRuleFor(storyType, 'icon');

export const classIconRule = (storyType) => iconRuleFor(storyType, 'className');

export const isStoryDontEstimated = (storyType, estimate) => storyType === 'feature' && !estimate;

export const isRelease = (storyType) => storyType === 'release';

export const estimateRule = (estimate) => estimate > 0 ? estimate : '-';

export const labelSplit = (labels) => labels.split(',');
