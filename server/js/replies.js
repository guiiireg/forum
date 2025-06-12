import db from "./database.js";

/**
 * Create a reply to a post
 * @param {string} content - The reply content
 * @param {number} postId - The post ID
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} The result of the creation
 */
export async function createReply(content, postId, userId) {
  try {
    const result = await db.run(
      "INSERT INTO replies (content, post_id, user_id) VALUES (?, ?, ?)",
      [content, postId, userId]
    );
    return {
      success: true,
      message: "Réponse créée avec succès",
      replyId: result.lastID,
    };
  } catch (error) {
    console.error("Erreur lors de la création de la réponse:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la création de la réponse",
    };
  }
}

/**
 * Get all replies for a post
 * @param {number} postId - The post ID
 * @returns {Promise<Object>} The replies
 */
export async function getRepliesByPost(postId) {
  try {
    const replies = await db.all(
      `
      SELECT r.*, u.username 
      FROM replies r
      JOIN users u ON r.user_id = u.id
      WHERE r.post_id = ?
      ORDER BY r.created_at ASC
      `,
      [postId]
    );
    return { success: true, replies };
  } catch (error) {
    console.error("Erreur lors de la récupération des réponses:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération des réponses",
    };
  }
}
