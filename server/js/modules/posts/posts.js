import { createPostElement, createPostForm } from "./postsUI.js";
import {
  handleEditPost,
  saveEditPost,
  handleDeletePost,
  handleCreatePost,
  cancelEditPost,
} from "./postActions.js";
import { handleVote, loadVotes, setupVoteListeners } from "./postVotes.js";
import { fetchCategories, fetchPosts } from "./postApi.js";
import {
  populateCategorySelect,
  createPostElement as createPostDOMElement,
  showError,
} from "./postDOMUtils.js";

/**
 * State management for posts
 */
const postsState = {
  currentUserId: null,
  currentUsername: null,
  isAuthenticated: false,
};

/**
 * Initializes the posts page with all necessary components
 * @returns {Promise<void>}
 */
export async function initializePosts() {
  initializeUserState();
  await initializeUI();
  await loadInitialData();
  setupEventListeners();
}

/**
 * Initializes user state from localStorage
 */
function initializeUserState() {
  postsState.currentUserId = localStorage.getItem("userId");
  postsState.currentUsername = localStorage.getItem("username");
  postsState.isAuthenticated = !!(
    postsState.currentUserId && postsState.currentUsername
  );
}

/**
 * Initializes the UI components
 * @returns {Promise<void>}
 */
async function initializeUI() {
  const createPostContainer = document.getElementById("create-post-container");

  if (!createPostContainer) return;

  if (!postsState.isAuthenticated) {
    createPostContainer.innerHTML =
      '<p>Vous devez être <a href="login.html">connecté</a> pour créer un post.</p>';
  } else {
    createPostContainer.innerHTML = createPostForm();
  }
}

/**
 * Loads initial data (categories and posts)
 * @returns {Promise<void>}
 */
async function loadInitialData() {
  await Promise.all([loadCategories(), loadPosts()]);
}

/**
 * Loads categories and populates select elements
 * @returns {Promise<void>}
 */
async function loadCategories() {
  try {
    const response = await fetchCategories();

    if (response.success) {
      // Populate create post category select
      populateCategorySelect("category", response.categories);

      // Populate filter category select
      populateCategorySelect(
        "category-filter-select",
        response.categories,
        "Toutes les catégories"
      );
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    showError("Erreur lors du chargement des catégories.");
  }
}

/**
 * Loads and displays posts
 * @param {number|null} categoryId - Category filter (null for all posts)
 * @returns {Promise<void>}
 */
async function loadPosts(categoryId = null) {
  const postsContainer = document.getElementById("posts-container");
  if (!postsContainer) return;

  try {
    const response = await fetchPosts(categoryId);

    if (response.success) {
      postsContainer.innerHTML = "";

      // Process posts in parallel
      const postElements = await Promise.all(
        response.posts.map((post) => createPostWithVotes(post))
      );

      // Add all posts to container
      postElements.forEach((postElement) => {
        postsContainer.appendChild(postElement);
      });

      setupGlobalPostHandlers();
    } else {
      showError("Erreur lors du chargement des posts.");
    }
  } catch (error) {
    console.error("Error loading posts:", error);
    postsContainer.innerHTML = "<p>Erreur lors du chargement des posts.</p>";
  }
}

/**
 * Creates a post element with vote data
 * @param {Object} post - Post data
 * @returns {Promise<HTMLElement>} Post DOM element
 */
async function createPostWithVotes(post) {
  const votes = await loadVotes(post.id, postsState.currentUserId);
  const isOwner =
    postsState.isAuthenticated &&
    parseInt(postsState.currentUserId) === post.user_id;

  const postHTML = createPostElement(post, isOwner, votes);
  const postElement = createPostDOMElement(postHTML);

  // Setup vote listeners if user is authenticated
  if (postsState.isAuthenticated) {
    setupVoteListeners(postElement, post.id, postsState.currentUserId);
  }

  return postElement;
}

/**
 * Sets up global post action handlers
 */
function setupGlobalPostHandlers() {
  // These functions need to be available globally for onclick handlers
  window.handleEditPost = (postId) => {
    const postElement = document.querySelector(`#post-${postId}`);
    if (postElement) {
      handleEditPost(postElement);
    }
  };

  window.handleDeletePost = async (postId) => {
    if (await handleDeletePost(postId, postsState.currentUserId)) {
      const categoryFilterSelect = document.getElementById(
        "category-filter-select"
      );
      const selectedCategoryId = categoryFilterSelect?.value || null;
      await loadPosts(selectedCategoryId);
    }
  };

  window.saveEditPost = async (postId) => {
    if (await saveEditPost(postId, postsState.currentUserId)) {
      const categoryFilterSelect = document.getElementById(
        "category-filter-select"
      );
      const selectedCategoryId = categoryFilterSelect?.value || null;
      await loadPosts(selectedCategoryId);
    }
  };

  window.cancelEditPost = (postId) => {
    cancelEditPost(postId);
  };
}

/**
 * Sets up event listeners for various UI components
 */
function setupEventListeners() {
  setupCategoryFilterListener();
  setupCreatePostFormListener();
}

/**
 * Sets up category filter change listener
 */
function setupCategoryFilterListener() {
  const categoryFilterSelect = document.getElementById(
    "category-filter-select"
  );

  if (categoryFilterSelect) {
    categoryFilterSelect.addEventListener("change", async () => {
      const selectedCategoryId = categoryFilterSelect.value || null;
      await loadPosts(selectedCategoryId);
    });
  }
}

/**
 * Sets up create post form submit listener
 */
function setupCreatePostFormListener() {
  const createPostFormElement = document.getElementById("create-post-form");

  if (createPostFormElement) {
    createPostFormElement.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (await handleCreatePost(postsState.currentUserId)) {
        const categoryFilterSelect = document.getElementById(
          "category-filter-select"
        );
        const selectedCategoryId = categoryFilterSelect?.value || null;
        await loadPosts(selectedCategoryId);
      }
    });
  }
}

/**
 * Refreshes posts list (useful for external calls)
 * @param {number|null} categoryId - Category filter
 * @returns {Promise<void>}
 */
export async function refreshPosts(categoryId = null) {
  await loadPosts(categoryId);
}

/**
 * Gets current user authentication status
 * @returns {boolean} Whether user is authenticated
 */
export function isUserAuthenticated() {
  return postsState.isAuthenticated;
}

/**
 * Gets current user ID
 * @returns {string|null} Current user ID
 */
export function getCurrentUserId() {
  return postsState.currentUserId;
}
