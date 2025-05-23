import db from "./database.js";

/**
 * Create a post
 * @param {string} title - The post title
 * @param {string} content - The post content
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} The result of the creation
 */
export async function createPost(title, content, userId) {
  try {
    const result = await db.run(
      "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
      [title, content, userId]
    );
    return {
      success: true,
      message: "Post créé avec succès",
      postId: result.lastID,
    };
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la création du post",
    };
  }
}

/**
 * Get all posts
 * @returns {Promise<Array>} The posts
 */
export async function getAllPosts() {
  try {
    const posts = await db.all(`
      SELECT p.*, u.username 
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    return { success: true, posts };
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération des posts",
    };
  }
}

/**
 * Get posts by user ID
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} The posts
 */
export async function getPostsByUser(userId) {
  try {
    const posts = await db.all(
      `
      SELECT p.*, u.username 
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      `,
      [userId]
    );
    return { success: true, posts };
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération des posts",
    };
  }
}
