import db from "../../database.js";
import { BaseModel } from "../../models/base.js";

/**
 * Post Ownership Service - Handles ownership verification and related operations
 */
export class PostOwnershipService extends BaseModel {
  constructor() {
    super("posts");
  }

  /**
   * Verify post ownership
   * @param {number} postId - The post ID
   * @param {number} userId - The user ID
   * @returns {Promise<Object>} Ownership verification result
   */
  async verifyOwnership(postId, userId) {
    try {
      const post = await db.get("SELECT user_id FROM posts WHERE id = ?", [
        postId,
      ]);

      if (!post) {
        return { success: false, message: "Post non trouvé" };
      }

      if (parseInt(post.user_id) !== parseInt(userId)) {
        return {
          success: false,
          message: "Vous n'êtes pas autorisé à modifier ce post",
        };
      }

      return { success: true };
    } catch (error) {
      return this.handleError(error, "la vérification des droits");
    }
  }

  /**
   * Check if user owns the post
   * @param {number} postId - The post ID
   * @param {number} userId - The user ID
   * @returns {Promise<boolean>} True if user owns the post
   */
  async isOwner(postId, userId) {
    const result = await this.verifyOwnership(postId, userId);
    return result.success;
  }

  /**
   * Get post owner ID
   * @param {number} postId - The post ID
   * @returns {Promise<number|null>} Owner user ID or null
   */
  async getOwnerId(postId) {
    try {
      const post = await db.get("SELECT user_id FROM posts WHERE id = ?", [
        postId,
      ]);
      return post?.user_id || null;
    } catch (error) {
      console.error("Erreur lors de la récupération du propriétaire:", error);
      return null;
    }
  }

  /**
   * Delete related data before post deletion
   * @param {number} postId - The post ID
   * @returns {Promise<Object>} The result of the cleanup
   */
  async deleteRelatedData(postId) {
    return this.executeQuery(async () => {
      // Delete votes first
      await db.run("DELETE FROM votes WHERE post_id = ?", [postId]);

      // Delete replies
      await db.run("DELETE FROM replies WHERE post_id = ?", [postId]);

      return { message: "Données liées supprimées avec succès" };
    }, "la suppression des données liées");
  }
}

export const postOwnershipService = new PostOwnershipService();
