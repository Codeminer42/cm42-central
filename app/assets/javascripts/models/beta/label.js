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

export const joinLabels = (labels) =>
  getNames(labels).join(',');

export const getNames = (labels) =>
  labels.map(label => label.name);
