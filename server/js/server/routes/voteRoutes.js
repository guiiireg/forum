import { votePost, getPostVotes, getUserVote } from "../../votes.js";

/**
 * Vote Routes Handler
 */
export class VoteRoutes {
  constructor(app) {
    this.app = app;
  }

  /**
   * Setup all vote routes
   */
  setupRoutes() {
    this.setupVotePost();
    this.setupGetVotes();
  }

  /**
   * Setup vote for a post route
   */
  setupVotePost() {
    this.app.post("/votes", async (req, res) => {
      const { postId, userId, voteType } = req.body;

      if (!postId || !userId || !voteType) {
        return res
          .status(400)
          .json({ success: false, message: "Données invalides" });
      }

      try {
        const result = await votePost(postId, userId, voteType);

        if (result.success) {
          const votes = await getPostVotes(postId);
          const userVote = await getUserVote(postId, userId);

          res.json({
            success: true,
            message: result.message,
            votes: {
              totalVotes: votes.totalVotes,
              userVote: userVote.voteType,
            },
          });
        } else {
          res.status(400).json({ success: false, message: result.message });
        }
      } catch (error) {
        console.error("Erreur lors du vote:", error);
        res
          .status(500)
          .json({ success: false, message: "Erreur interne du serveur" });
      }
    });
  }

  /**
   * Setup get votes for a post route
   */
  setupGetVotes() {
    this.app.get("/votes/:postId", async (req, res) => {
      const postId = req.params.postId;
      const userId = req.query.userId;

      try {
        const votes = await getPostVotes(postId);
        const userVote = userId
          ? await getUserVote(postId, userId)
          : { voteType: 0 };

        res.json({
          success: true,
          totalVotes: votes.totalVotes,
          userVote: userVote.voteType,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des votes:", error);
        res
          .status(500)
          .json({ success: false, message: "Erreur interne du serveur" });
      }
    });
  }
}
