export const wait = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });
