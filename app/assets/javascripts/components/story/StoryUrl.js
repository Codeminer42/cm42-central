export const storyUrl  = ( story ) => {
  const location = window.location.href;
  const hashIndex = location.indexOf('#');
  const endIndex = hashIndex > 0 ? hashIndex : location.length;
  return `${location.substring(0, endIndex)}#story-${story.id}`;
};
