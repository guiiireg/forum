/**
 * Posts Page - Entry point for the posts creation page
 */

import { initAuth } from "../core/auth.js";
import { initializePosts } from "../modules/posts/index.js";

/**
 * Initialize the posts page
 */
function initPostsPage() {
  initAuth();

  initializePosts();
}

document.addEventListener("DOMContentLoaded", initPostsPage);
