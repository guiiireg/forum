/**
 * Home Page - Main entry point for the home page
 */

import { initAuth } from "../core/auth.js";
import { initSidebarToggle } from "../core/dom.js";
import { initializePosts } from "../modules/posts/index.js";

/**
 * Initialize the home page
 */
function initHomePage() {
  initAuth();
  initSidebarToggle();
  const postsContainer = document.getElementById("posts-container");
  if (postsContainer) {
    initializePosts();
  }
}

document.addEventListener("DOMContentLoaded", initHomePage);
