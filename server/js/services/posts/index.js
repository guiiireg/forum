import { postCrudService } from "./postCrudService.js";
import { postOwnershipService } from "./postOwnershipService.js";
import { postQueryService } from "./postQueryService.js";

/**
 * Unified Post Service - Combines all post-related services
 */
export class PostService {
  constructor() {
    this.crud = postCrudService;
    this.ownership = postOwnershipService;
    this.query = postQueryService;
  }

  async getAll() {
    return this.query.getAll();
  }

  async getByUser(userId) {
    return this.query.getByUser(userId);
  }

  async getByCategory(categoryId) {
    return this.query.getByCategory(categoryId);
  }

  async getById(postId) {
    return this.query.getById(postId);
  }

  async create(postData) {
    return this.crud.create(postData);
  }

  async update(postId, updateData) {
    const { userId, ...data } = updateData;

    const ownershipCheck = await this.ownership.verifyOwnership(postId, userId);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }
    return this.crud.updatePost(postId, data);
  }

  async delete(postId, userId) {
    const ownershipCheck = await this.ownership.verifyOwnership(postId, userId);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }
    await this.ownership.deleteRelatedData(postId);
    return this.crud.deletePost(postId);
  }
}

export { postCrudService } from "./postCrudService.js";
export { postOwnershipService } from "./postOwnershipService.js";
export { postQueryService } from "./postQueryService.js";

export const postService = new PostService();
