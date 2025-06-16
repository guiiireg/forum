import { getCurrentUser } from "../../core/auth.js";
import {
  updateCurrentUserState,
  getCurrentPosts,
  getCurrentFilters,
} from "./postsState.js";
import { loadCategories, loadPosts } from "./postsDataLoader.js";
import { applyFilters } from "./postsFilter.js";
import { displayPosts, setupUI, createPostElement } from "./postsDisplay.js";
import { setupPostVoting } from "./postsVoting.js";
import { setupEventListeners } from "./postsEventHandlers.js";
import { editPost, deletePostHandler } from "./postsActions.js";

export async function initializePosts() {
  const currentUser = getCurrentUser();
  updateCurrentUserState(currentUser);

  await new Promise((resolve) => setTimeout(resolve, 100));

  setupUI();
  await loadCategories();
  await refreshPosts();
  setupEventListeners(refreshPosts, refreshPosts);
}

async function refreshPosts() {
  const posts = await loadPosts();
  const filters = getCurrentFilters();
  const filteredPosts = applyFilters(posts, filters);
  await displayPostsWithVoting(filteredPosts);
}

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
