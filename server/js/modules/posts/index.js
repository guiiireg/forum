/**
 * Posts Module - Main posts functionality orchestrator
 */
import { getCurrentUser } from "../../lib/auth.js";
import {
  updateCurrentUserState,
  getCurrentPosts,
  getCurrentFilters,
  applyFilters,
  setupEventListeners,
  loadCategories,
  loadPosts,
} from "./postsState.js";
import { displayPosts, setupUI, createPostElement } from "./postsDisplay.js";
import { setupPostVoting } from "./postsVoting.js";
import { editPost, deletePostHandler } from "./postsActions.js";

/**
 * Initialize posts module
 */
export async function initializePosts() {
  const currentUser = getCurrentUser();
  updateCurrentUserState(currentUser);

  await new Promise((resolve) => setTimeout(resolve, 100));

  setupUI();
  await loadCategories();
  await refreshPosts();
  setupEventListeners(refreshPosts, refreshPosts);
}

/**
 * Refresh posts display with current filters
 */
async function refreshPosts() {
  const posts = await loadPosts();
  const filters = getCurrentFilters();
  const filteredPosts = applyFilters(posts, filters);
  await displayPostsWithVoting(filteredPosts);
}

/**
 * Display posts with voting setup
 * @param {Array} posts - Posts to display
 */
async function displayPostsWithVoting(posts) {
  await displayPosts(posts);

  const currentUser = getCurrentUser();
  if (currentUser) {
    posts.forEach((post) => {
      const postElement = document.getElementById(`post-${post.id}`);
      if (postElement) {
        setupPostVoting(postElement, post.id);
      }
    });
  }
}

window.editPost = (postId) => editPost(postId, getCurrentPosts());
window.deletePostHandler = (postId) => deletePostHandler(postId, refreshPosts);

export { refreshPosts as updateFilters, refreshPosts as loadPosts };
