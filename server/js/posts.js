import { postService } from "./services/postService.js";

export async function createPost(title, content, userId, categoryId = null) {
  return postService.create({ title, content, userId, categoryId });
}

export async function getAllPosts() {
  return postService.getAll();
}

export async function getPostsByUser(userId) {
  return postService.getByUser(userId);
}

export async function getPostsByCategory(categoryId) {
  return postService.getByCategory(categoryId);
}

export async function getPostById(postId) {
  return postService.getById(postId);
}

export async function updatePost(
  postId,
  title,
  content,
  userId,
  categoryId = null
) {
  return postService.update(postId, { title, content, userId, categoryId });
}

export async function deletePost(postId, userId) {
  return postService.delete(postId, userId);
}
