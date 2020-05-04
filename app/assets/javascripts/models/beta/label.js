import _ from 'underscore';

export const splitLabels = (labels) => {
  if (labels) {
    return labels.split(',')
      .map((label, index) => (
        {
          id: index,
          name: label
        }
      ))
  }

  return [];
};

export const removeLabel = (labels, labelName) =>
  labels.filter(label => label.name !== labelName);

export const addLabel = (labels, newLabel) =>
  uniqueLabels([
    ...labels,
    newLabel
  ]);

export const uniqueLabels = (labels) =>
  _.uniq(labels, label => label.name);

export const joinLabels = (labels) =>
  getNames(labels).join(',');

export const getNames = (labels) =>
  labels.map(label => label.name);

export const hasLabel = (labels, label) => labels.includes(label);
