import { createPost } from "../../../posts.js";
import db from "../../../database.js";

/**
 * Post Create Routes Handler
 */
export class PostCreateRoutes {
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
   * Setup create post route
   */
  setupRoutes() {
    this.setupCreatePost();
  }

  /**
   * Setup create post route
   */
  setupCreatePost() {
    this.app.post("/posts", async (req, res) => {
      const { title, content, userId, categoryId } = req.body;

      if (!title || !content || !userId) {
        return res
          .status(400)
          .json({ success: false, message: "Données invalides" });
      }

      try {
        if (!(await this.verifyUser(userId))) {
          return res
            .status(401)
            .json({ success: false, message: "Utilisateur non authentifié" });
        }

        const result = await createPost(title, content, userId, categoryId);

        if (result.success) {
          res.json({
            success: true,
            message: result.message,
            postId: result.postId,
          });
        } else {
          res.status(400).json({ success: false, message: result.message });
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'utilisateur:",
          error
        );
        res
          .status(500)
          .json({ success: false, message: "Erreur interne du serveur" });
      }
    });
  }
}
