import { postCrudService } from "./postCrudService.js";

export class PostQueryService {
  async getAll() {
    return postCrudService.getPosts();
  }

  async getByUser(userId) {
    return postCrudService.getPosts({ userId });
  }

  async getByCategory(categoryId) {
    return postCrudService.getPosts({ categoryId });
  }

  async getById(postId) {
    return postCrudService.getById(postId);
  }

  async search(searchTerm) {
    return postCrudService.getPosts();
  }

  async getRecent(limit = 10) {
    return postCrudService.getPosts();
  }

  async getPaginated(page = 1, limit = 10) {
    return postCrudService.getPosts();
  }
}

export const postQueryService = new PostQueryService();
