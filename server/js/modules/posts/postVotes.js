import { submitVote, fetchVotes } from './postApi.js';
import { validateUserAuth } from './postValidation.js';

/**
 * Handles voting on a post
 * @param {number} postId - ID of the post to vote on
 * @param {string|number} userId - ID of the user voting
 * @param {number} voteType - Vote type (1 for upvote, -1 for downvote)
 * @returns {Promise<boolean>} Success status
 */
export async function handleVote(postId, userId, voteType) {
  const userValidation = validateUserAuth(userId);
  if (!userValidation.isValid) {
    alert(userValidation.error);
    return false;
  }

  try {
    const voteData = {
      postId: parseInt(postId),
      userId: parseInt(userId),
      voteType: parseInt(voteType),
    };

    const response = await submitVote(voteData);

    if (response.success) {
      updateVoteUI(postId, response.votes);
      return true;
    } else {
      alert(response.message);
      return false;
    }
  } catch (error) {
    console.error("Error handling vote:", error);
    alert("Une erreur est survenue lors du vote.");
    return false;
  }
}

/**
 * Updates the vote UI for a specific post
 * @param {number} postId - ID of the post
 * @param {Object} voteData - Vote data containing totalVotes and userVote
 */
export function updateVoteUI(postId, voteData) {
  const voteContainer = document.getElementById(`vote-container-${postId}`);
  if (!voteContainer) return;

  const voteCount = voteContainer.querySelector(".vote-count");
  const upvoteBtn = voteContainer.querySelector(".upvote-button");
  const downvoteBtn = voteContainer.querySelector(".downvote-button");

  if (voteCount) {
    voteCount.textContent = voteData.totalVotes;
  }

  if (upvoteBtn && downvoteBtn) {
    // Reset vote button states
    upvoteBtn.classList.remove("upvoted");
    downvoteBtn.classList.remove("downvoted");

    // Apply current vote state
    if (voteData.userVote === 1) {
      upvoteBtn.classList.add("upvoted");
    } else if (voteData.userVote === -1) {
      downvoteBtn.classList.add("downvoted");
    }
  }
}

/**
 * Loads and returns vote data for a post
 * @param {number} postId - ID of the post
 * @param {string|number} userId - ID of the current user (optional)
 * @returns {Promise<Object>} Vote data with totalVotes and userVote
 */
export async function loadVotes(postId, userId = null) {
  try {
    const response = await fetchVotes(postId, userId);

    if (response.success) {
      return {
        totalVotes: response.totalVotes,
        userVote: response.userVote,
      };
    }
    
    return { totalVotes: 0, userVote: 0 };
  } catch (error) {
    console.error("Error loading votes:", error);
    return { totalVotes: 0, userVote: 0 };
  }
}

/**
 * Sets up vote event listeners for a post element
 * @param {HTMLElement} postElement - The post DOM element
 * @param {number} postId - ID of the post
 * @param {string|number} userId - ID of the current user
 */
export function setupVoteListeners(postElement, postId, userId) {
  const upvoteBtn = postElement.querySelector(".upvote-button");
  const downvoteBtn = postElement.querySelector(".downvote-button");

  if (upvoteBtn) {
    upvoteBtn.addEventListener("click", () => handleVote(postId, userId, 1));
  }

  if (downvoteBtn) {
    downvoteBtn.addEventListener("click", () => handleVote(postId, userId, -1));
  }
} 