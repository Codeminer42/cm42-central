import httpService from './httpService';

const ProjectStoriesService = {
  async fetchStory(story) {
    return httpService.get(`/projects/${story.projectId}/stories/${story.id}`);
  },
};

export default ProjectStoriesService;
