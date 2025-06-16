import { updatePost, deletePost } from "../../../posts.js";
import { PostAuthHelper } from "./postAuthHelper.js";

export class PostUpdateRoutes {
  constructor(app) {
    this.app = app;
    this.authHelper = new PostAuthHelper();
  }

  setupRoutes() {
    this.setupUpdatePost();
    this.setupDeletePost();
  }

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
        if (!(await this.authHelper.verifyUser(parseInt(userId)))) {
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
        if (!(await this.authHelper.verifyUser(parseInt(userId)))) {
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
