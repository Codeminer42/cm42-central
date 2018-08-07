
const compareValues = (a ,b) => {
  if (a > b) return 1;

  if (a < b) return -1;

  return 0;
}

export const comparePosition = (a, b) => {
  const positionA = parseFloat(a.position);
  const positionB = parseFloat(b.position);

  return compareValues(positionA, positionB);
}

export const compareAcceptedAt = (a, b) => {
  return compareValues(a.acceptedAt, b.acceptedAt);
}

