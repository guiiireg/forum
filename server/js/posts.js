import { postService } from "./services/postService.js";

/**
 * Create a post
 * @param {string} title - The post title
 * @param {string} content - The post content
 * @param {number} userId - The user ID
 * @param {number} categoryId - The category ID (optional)
 * @returns {Promise<Object>} The result of the creation
 */
export async function createPost(title, content, userId, categoryId = null) {
  return postService.create({ title, content, userId, categoryId });
}

/**
 * Get all posts
 * @returns {Promise<Array>} The posts
 */
export async function getAllPosts() {
  return postService.getAll();
}

/**
 * Get posts by user ID
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} The posts
 */
export async function getPostsByUser(userId) {
  return postService.getByUser(userId);
}

/**
 * Get posts by category ID
 * @param {number} categoryId - The category ID
 * @returns {Promise<Array>} The posts
 */
export async function getPostsByCategory(categoryId) {
  return postService.getByCategory(categoryId);
}

/**
 * Get a post by ID
 * @param {number} postId - The post ID
 * @returns {Promise<Object>} The post
 */
export async function getPostById(postId) {
  return postService.getById(postId);
}

/**
 * Update a post
 * @param {number} postId - The post ID
 * @param {string} title - The new post title
 * @param {string} content - The new post content
 * @param {number} userId - The user ID (for ownership verification)
 * @param {number} categoryId - The new category ID (optional)
 * @returns {Promise<Object>} The result of the update
 */
export async function updatePost(
  postId,
  title,
  content,
  userId,
  categoryId = null
) {
  return postService.update(postId, { title, content, userId, categoryId });
}

/**
 * Delete a post
 * @param {number} postId - The post ID
 * @param {number} userId - The user ID (for ownership verification)
 * @returns {Promise<Object>} The result of the deletion
 */
export async function deletePost(postId, userId) {
  return postService.delete(postId, userId);
}
