import { createReply, getRepliesByPost } from "../../replies.js";
import db from "../../database.js";

export class ReplyRoutes {
  constructor(app) {
    this.app = app;
  }

  setupRoutes() {
    this.setupGetReplies();
    this.setupCreateReply();
  }

  async verifyUser(userId) {
    const user = await db.get("SELECT id FROM users WHERE id = ?", [userId]);
    return !!user;
  }

  setupGetReplies() {
    this.app.get("/api/replies/:postId", async (req, res) => {
      const postId = req.params.postId;
      const result = await getRepliesByPost(postId);

      if (result.success) {
        res.json({ success: true, replies: result.replies });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    });
  }

  setupCreateReply() {
    this.app.post("/api/replies", async (req, res) => {
      const { content, postId, userId } = req.body;

      if (!content || !postId || !userId) {
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

        const result = await createReply(content, postId, userId);

        if (result.success) {
          res.json({
            success: true,
            message: result.message,
            replyId: result.replyId,
          });
        } else {
          res.status(400).json({ success: false, message: result.message });
        }
      } catch (error) {
        console.error("Erreur lors de la création de la réponse:", error);
        res
          .status(500)
          .json({ success: false, message: "Erreur interne du serveur" });
      }
    });
  }
}
