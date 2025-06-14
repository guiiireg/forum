import { updatePost, deletePost } from "../../../posts.js";
import db from "../../../database.js";

/**
 * Post Update Routes Handler
 */
export class PostUpdateRoutes {
  constructor(app) {
    this.app = app;
  }

  /**
   * Verify user authentication
   * @param {number} userId - The user ID to verify
   * @returns {Promise<boolean>} True if user exists and is authenticated
   */
  async verifyUser(userId) {
    const user = await db.get("SELECT id FROM users WHERE id = ?", [userId]);
    return !!user;
  }

  /**
   * Setup update and delete routes
   */
  setupRoutes() {
    this.setupUpdatePost();
    this.setupDeletePost();
  }

  /**
   * Setup update post route
   */
  setupUpdatePost() {
    this.app.put("/posts/:postId", async (req, res) => {
      const postId = parseInt(req.params.postId);
      const { title, content, userId, categoryId } = req.body;

      if (!title || !content || !userId) {
        return res
          .status(400)
          .json({ success: false, message: "Données invalides" });
      }

      try {
        if (!(await this.verifyUser(parseInt(userId)))) {
          return res
            .status(401)
            .json({ success: false, message: "Utilisateur non authentifié" });
        }

        const result = await updatePost(
          postId,
          title,
          content,
          parseInt(userId),
          categoryId ? parseInt(categoryId) : null
        );

        if (result.success) {
          res.json({ success: true, message: result.message });
        } else {
          res.status(400).json({ success: false, message: result.message });
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du post:", error);
        res
          .status(500)
          .json({ success: false, message: "Erreur interne du serveur" });
      }
    });
  }

  /**
   * Setup delete post route
   */
  setupDeletePost() {
    this.app.delete("/posts/:postId", async (req, res) => {
      const postId = parseInt(req.params.postId);
      const { userId } = req.body;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "Données invalides" });
      }

      try {
        if (!(await this.verifyUser(parseInt(userId)))) {
          return res
            .status(401)
            .json({ success: false, message: "Utilisateur non authentifié" });
        }

        const result = await deletePost(postId, parseInt(userId));

        if (result.success) {
          res.json({ success: true, message: result.message });
        } else {
          res.status(400).json({ success: false, message: result.message });
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du post:", error);
        res
          .status(500)
          .json({ success: false, message: "Erreur interne du serveur" });
      }
    });
  }
}
