import db from "../../database.js";
import { BaseModel } from "../../models/base.js";

export class PostOwnershipService extends BaseModel {
  constructor() {
    super("posts");
  }

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

  async isOwner(postId, userId) {
    const result = await this.verifyOwnership(postId, userId);
    return result.success;
  }

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

  async deleteRelatedData(postId) {
    return this.executeQuery(async () => {
      await db.run("DELETE FROM votes WHERE post_id = ?", [postId]);
      await db.run("DELETE FROM replies WHERE post_id = ?", [postId]);

      return { message: "Données liées supprimées avec succès" };
    }, "la suppression des données liées");
  }
}

export const postOwnershipService = new PostOwnershipService();
