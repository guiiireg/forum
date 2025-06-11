import db from "./database.js";

/**
 * Add or update a vote for a post
 * @param {number} postId - The post ID
 * @param {number} userId - The user ID
 * @param {number} voteType - The vote type (1 for upvote, -1 for downvote)
 * @returns {Promise<Object>} The result of the operation
 */
export async function votePost(postId, userId, voteType) {
  try {
    const post = await db.get("SELECT id FROM posts WHERE id = ?", [postId]);
    if (!post) {
      return { success: false, message: "Post non trouvé" };
    }

    const currentVotes = await getPostVotes(postId);
    const existingVote = await db.get(
      "SELECT vote_type FROM votes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );

    if (voteType === -1 && currentVotes.totalVotes === 0 && !existingVote) {
      return {
        success: false,
        message: "Il ne peut pas y avoir moins de 0 vote",
      };
    }

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        await db.run("DELETE FROM votes WHERE post_id = ? AND user_id = ?", [
          postId,
          userId,
        ]);
        return { success: true, message: "Vote supprimé" };
      } else {
        if (voteType === -1 && currentVotes.totalVotes === 0) {
          return {
            success: false,
            message: "Il ne peut pas y avoir moins de 0 vote",
          };
        }
        await db.run(
          "UPDATE votes SET vote_type = ? WHERE post_id = ? AND user_id = ?",
          [voteType, postId, userId]
        );
        return { success: true, message: "Vote mis à jour" };
      }
    } else {
      if (voteType === -1 && currentVotes.totalVotes === 0) {
        return {
          success: false,
          message: "Il ne peut pas y avoir moins de 0 vote",
        };
      }
      await db.run(
        "INSERT INTO votes (post_id, user_id, vote_type) VALUES (?, ?, ?)",
        [postId, userId, voteType]
      );
      return { success: true, message: "Vote ajouté" };
    }
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return { success: false, message: "Une erreur est survenue lors du vote" };
  }
}

/**
 * Get votes for a post
 * @param {number} postId - The post ID
 * @returns {Promise<Object>} The votes information
 */
export async function getPostVotes(postId) {
  try {
    const votes = await db.all(
      "SELECT vote_type FROM votes WHERE post_id = ?",
      [postId]
    );

    const totalVotes = votes.reduce(
      (sum, vote) => sum + parseInt(vote.vote_type, 10),
      0
    );

    return {
      success: true,
      totalVotes,
      upvotes: votes.filter((vote) => parseInt(vote.vote_type, 10) === 1)
        .length,
      downvotes: votes.filter((vote) => parseInt(vote.vote_type, 10) === -1)
        .length,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des votes:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération des votes",
    };
  }
}

/**
 * Get user's vote for a post
 * @param {number} postId - The post ID
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} The user's vote
 */
export async function getUserVote(postId, userId) {
  try {
    const vote = await db.get(
      "SELECT vote_type FROM votes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );

    return {
      success: true,
      voteType: vote ? parseInt(vote.vote_type, 10) : 0,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du vote de l'utilisateur:",
      error
    );
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération du vote",
    };
  }
}
