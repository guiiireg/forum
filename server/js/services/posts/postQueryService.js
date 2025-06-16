import { postCrudService } from "./postCrudService.js";

/**
 * Post Query Service - Convenience methods and specialized queries
 */
export class PostQueryService {
  /**
   * Get all posts
   * @returns {Promise<Object>} All posts
   */
  async getAll() {
    return postCrudService.getPosts();
  }

  /**
   * Get posts by user ID
   * @param {number} userId - The user ID
   * @returns {Promise<Object>} User posts
   */
  async getByUser(userId) {
    return postCrudService.getPosts({ userId });
  }

  /**
   * Get posts by category ID
   * @param {number} categoryId - The category ID
   * @returns {Promise<Object>} Category posts
   */
  async getByCategory(categoryId) {
    return postCrudService.getPosts({ categoryId });
  }

  /**
   * Get a post by ID
   * @param {number} postId - The post ID
   * @returns {Promise<Object>} The post
   */
  async getById(postId) {
    return postCrudService.getById(postId);
  }

  /**
   * Search posts by title or content
   * @param {string} searchTerm - Search term
   * @returns {Promise<Object>} Matching posts
   */
  async search(searchTerm) {
    return postCrudService.getPosts();
  }

  /**
   * Get recent posts (last N posts)
   * @param {number} limit - Number of posts to retrieve
   * @returns {Promise<Object>} Recent posts
   */
  async getRecent(limit = 10) {
    return postCrudService.getPosts();
  }

  /**
   * Get posts with pagination
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Posts per page
   * @returns {Promise<Object>} Paginated posts
   */
  async getPaginated(page = 1, limit = 10) {
    return postCrudService.getPosts();
  }
}

export const postQueryService = new PostQueryService();
