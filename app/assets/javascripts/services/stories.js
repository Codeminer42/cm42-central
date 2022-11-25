import httpService from "./httpService";

class ProjectStoriesService {
  async fetchStory(story) {
    return httpService.get(`/projects/${story.projectId}/stories/${story.id}`);
  }
}

export default new ProjectStoriesService();
