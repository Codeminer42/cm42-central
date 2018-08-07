
export const comparePosition = (a, b) => {
  const positionA = parseFloat(a.position);
  const positionB = parseFloat(b.position);

  if (positionA > positionB) return 1;

  if (positionA < positionB) return -1;

  return 0;
}

