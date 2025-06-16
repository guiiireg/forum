import { createPost } from "../../../posts.js";
import { PostAuthHelper } from "./postAuthHelper.js";

export class PostCreateRoutes {
  constructor(app) {
    this.app = app;
    this.authHelper = new PostAuthHelper();
  }

  setupRoutes() {
    this.setupCreatePost();
  }

  setupCreatePost() {
    this.app.post("/posts", async (req, res) => {
      const { title, content, userId, categoryId } = req.body;

      if (!title || !content || !userId) {
        return res
          .status(400)
          .json({ success: false, message: "Données invalides" });
      }

      try {
        if (!(await this.authHelper.verifyUser(userId))) {
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
