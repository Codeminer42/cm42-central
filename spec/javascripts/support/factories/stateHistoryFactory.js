const createState = ({ status, activities, storyTitle } = {}) => ({
  status: status || "DISABLED",
  activities: activities || null,
  storyTitle: storyTitle || null
});

export default createState;
