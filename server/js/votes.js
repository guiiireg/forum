import db from "./database.js";

export async function votePost(postId, userId, voteType) {
  try {
    console.log("=== DÉBUT DU VOTE ===");
    console.log("Paramètres reçus:", { postId, userId, voteType });

    const post = await db.get("SELECT id FROM posts WHERE id = ?", [postId]);
    if (!post) {
      console.log("Post non trouvé");
      return { success: false, message: "Post non trouvé" };
    }

    const currentVotes = await getPostVotes(postId);
    console.log("Votes actuels:", currentVotes);

    const existingVote = await db.get(
      "SELECT vote_type FROM votes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );
    console.log("Vote existant:", existingVote);

    if (existingVote) {
      console.log("Vote existant trouvé:", existingVote.vote_type);

      if (existingVote.vote_type === voteType) {
        console.log("Même vote détecté, suppression du vote");
        await db.run("DELETE FROM votes WHERE post_id = ? AND user_id = ?", [
          postId,
          userId,
        ]);
        return { success: true, message: "Vote supprimé" };
      } else {
        console.log("Vote différent détecté, changement de vote");
        await db.run("DELETE FROM votes WHERE post_id = ? AND user_id = ?", [
          postId,
          userId,
        ]);

        const newTotal =
          currentVotes.totalVotes - existingVote.vote_type + voteType;
        console.log("Calcul du nouveau total:", {
          currentTotal: currentVotes.totalVotes,
          oldVote: existingVote.vote_type,
          newVote: voteType,
          newTotal: newTotal,
        });

        if (newTotal < 0 && currentVotes.totalVotes > 0) {
          console.log("Refus du vote: total serait négatif");
          return {
            success: false,
            message: "Il ne peut pas y avoir moins de 0 vote",
          };
        }

        console.log("Ajout du nouveau vote");
        await db.run(
          "INSERT INTO votes (post_id, user_id, vote_type) VALUES (?, ?, ?)",
          [postId, userId, voteType]
        );
        return { success: true, message: "Vote mis à jour" };
      }
    } else {
      console.log("Pas de vote existant, nouveau vote");
      const newTotal = currentVotes.totalVotes + voteType;
      console.log("Calcul du nouveau total:", {
        currentTotal: currentVotes.totalVotes,
        newVote: voteType,
        newTotal: newTotal,
      });

      if (newTotal < 0 && currentVotes.totalVotes > 0) {
        console.log("Refus du vote: total serait négatif");
        return {
          success: false,
          message: "Il ne peut pas y avoir moins de 0 vote",
        };
      }

      console.log("Ajout du nouveau vote");
      await db.run(
        "INSERT INTO votes (post_id, user_id, vote_type) VALUES (?, ?, ?)",
        [postId, userId, voteType]
      );
      return { success: true, message: "Vote ajouté" };
    }
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return { success: false, message: "Une erreur est survenue lors du vote" };
  } finally {
    console.log("=== FIN DU VOTE ===");
  }
}

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
