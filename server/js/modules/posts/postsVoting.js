import { fetchVotes, submitVote, safeApiCall } from "../../core/api.js";
import { getCurrentUser } from "./postsState.js";

/**
 * Load votes for a post
 * @param {number} postId - Post ID
 * @param {number} userId - User ID
 * @returns {Object} Vote data
 */
export async function loadVotesForPost(postId, userId) {
  const result = await safeApiCall(
    () => fetchVotes(parseInt(postId), parseInt(userId)),
    "chargement des votes"
  );

  return result.success ? result : { totalVotes: 0, userVote: 0 };
}

/**
 * Setup voting functionality for a post
 * @param {HTMLElement} postElement - Post element
 * @param {number} postId - Post ID
 */
export function setupPostVoting(postElement, postId) {
  const upvoteBtn = postElement.querySelector(".upvote-button");
  const downvoteBtn = postElement.querySelector(".downvote-button");

  if (upvoteBtn) {
    upvoteBtn.addEventListener("click", () =>
      handleVote(postId, 1, postElement)
    );
  }

  if (downvoteBtn) {
    downvoteBtn.addEventListener("click", () =>
      handleVote(postId, -1, postElement)
    );
  }
}

/**
 * Handle voting
 * @param {number} postId - Post ID
 * @param {number} voteType - Vote type (1 or -1)
 * @param {HTMLElement} postElement - Post element
 */
export async function handleVote(postId, voteType, postElement) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const result = await safeApiCall(
    () =>
      submitVote(
        parseInt(postId),
        parseInt(voteType),
        parseInt(currentUser.id)
      ),
    "enregistrement du vote"
  );

  if (result.success) {
    updateVoteUI(postElement, result.votes);
  }
}

/**
 * Update vote UI elements
 * @param {HTMLElement} postElement - Post element
 * @param {Object} votes - Vote data
 */
function updateVoteUI(postElement, votes) {
  const voteCount = postElement.querySelector(".vote-count");
  const upvoteBtn = postElement.querySelector(".upvote-button");
  const downvoteBtn = postElement.querySelector(".downvote-button");
  const likesSpan = postElement.querySelector(".likes");

  if (voteCount) {
    voteCount.textContent = votes.totalVotes || 0;
  }

  if (upvoteBtn) {
    upvoteBtn.classList.toggle("upvoted", votes.userVote === 1);
    upvoteBtn.classList.toggle("not-voted", votes.userVote !== 1);
  }

  if (downvoteBtn) {
    downvoteBtn.classList.toggle("downvoted", votes.userVote === -1);
    downvoteBtn.classList.toggle("not-voted", votes.userVote !== -1);
  }

  if (likesSpan) {
    likesSpan.textContent = `❤️ ${votes.totalVotes || 0}`;
  }
}
