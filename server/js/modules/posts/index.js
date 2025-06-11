/**
 * Posts Module - Main posts functionality
 */

import { getCurrentUser, isAuthenticated } from "../../core/auth.js";
import {
  populateSelect,
  createElementFromHTML,
  showError,
  getFormData,
  resetForm,
  showLoading,
  hideLoading,
} from "../../core/dom.js";
import {
  fetchCategories,
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  submitVote,
  fetchVotes,
  safeApiCall,
} from "../../core/api.js";

// ==================== STATE MANAGEMENT ====================

const postsState = {
  currentUser: null,
  posts: [],
  categories: [],
  currentFilters: {
    category: "",
    sortBy: "date",
    order: "desc",
  },
};

// ==================== INITIALIZATION ====================

/**
 * Initialize posts module
 */
export async function initializePosts() {
  postsState.currentUser = getCurrentUser();

  await Promise.all([loadCategories(), loadPosts()]);

  setupEventListeners();
  setupUI();
}

// ==================== DATA LOADING ====================

/**
 * Load categories and populate selects
 */
async function loadCategories() {
  const result = await safeApiCall(
    () => fetchCategories(),
    "chargement des catégories"
  );

  if (result.success) {
    postsState.categories = result.categories;

    // Populate category selects
    populateSelect("category", result.categories);
    populateSelect(
      "category-filter-select",
      result.categories,
      "Toutes les catégories"
    );
  }
}

/**
 * Load posts with current filters
 */
async function loadPosts() {
  const result = await safeApiCall(() => fetchPosts(), "chargement des posts");

  if (result.success) {
    postsState.posts = result.posts;
    displayPosts(applyFilters(postsState.posts, postsState.currentFilters));
  }
}

// ==================== FILTERING AND SORTING ====================

/**
 * Apply filters and sorting to posts
 * @param {Array} posts - Posts to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered posts
 */
function applyFilters(posts, filters) {
  let filteredPosts = [...posts];

  // Filter by category
  if (filters.category && filters.category !== "") {
    filteredPosts = filteredPosts.filter(
      (post) => post.category_id == filters.category
    );
  }

  // Sort posts
  filteredPosts.sort((a, b) => {
    let valueA, valueB;

    switch (filters.sortBy) {
      case "likes":
        valueA = a.total_votes || 0;
        valueB = b.total_votes || 0;
        break;
      case "replies":
        valueA = a.reply_count || 0;
        valueB = b.reply_count || 0;
        break;
      case "date":
      default:
        valueA = new Date(a.created_at);
        valueB = new Date(b.created_at);
        break;
    }

    return filters.order === "asc"
      ? valueA > valueB
        ? 1
        : -1
      : valueA < valueB
      ? 1
      : -1;
  });

  return filteredPosts;
}

/**
 * Update filters and reload posts
 * @param {Object} newFilters - New filter values
 */
async function updateFilters(newFilters) {
  postsState.currentFilters = { ...postsState.currentFilters, ...newFilters };
  const filteredPosts = applyFilters(
    postsState.posts,
    postsState.currentFilters
  );
  displayPosts(filteredPosts);
}

// ==================== UI DISPLAY ====================

/**
 * Display posts in the container
 * @param {Array} posts - Posts to display
 */
async function displayPosts(posts) {
  const container = document.getElementById("posts-container");
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = "<p>Aucun post trouvé avec ces filtres.</p>";
    return;
  }

  container.innerHTML = "";

  for (const post of posts) {
    const postElement = await createPostElement(post);
    container.appendChild(postElement);
  }
}

/**
 * Create a post element with votes
 * @param {Object} post - Post data
 * @returns {HTMLElement} Post element
 */
async function createPostElement(post) {
  const votes = postsState.currentUser
    ? await loadVotesForPost(post.id, postsState.currentUser.id)
    : { totalVotes: post.total_votes || 0, userVote: 0 };

  const isOwner =
    postsState.currentUser &&
    parseInt(postsState.currentUser.id) === post.user_id;

  const postHTML = generatePostHTML(post, isOwner, votes);
  const postElement = createElementFromHTML(postHTML);

  if (postsState.currentUser) {
    setupPostVoting(postElement, post.id);
  }

  return postElement;
}

/**
 * Generate HTML for a post
 * @param {Object} post - Post data
 * @param {boolean} isOwner - Whether current user owns the post
 * @param {Object} votes - Vote data
 * @returns {string} HTML string
 */
function generatePostHTML(post, isOwner, votes) {
  const actionsHtml = isOwner
    ? `
    <div class="post-actions">
      <button onclick="editPost(${post.id})" class="edit-btn">✏️ Modifier</button>
      <button onclick="deletePostHandler(${post.id})" class="delete-btn">🗑️ Supprimer</button>
    </div>
  `
    : "";

  return `
    <div class="post" id="post-${post.id}">
      <div class="vote-container" id="vote-container-${post.id}">
        <button class="vote-button upvote-button ${
          votes.userVote === 1 ? "upvoted" : ""
        }">▲</button>
        <span class="vote-count">${votes.totalVotes}</span>
        <button class="vote-button downvote-button ${
          votes.userVote === -1 ? "downvoted" : ""
        }">▼</button>
      </div>
      <div class="post-content">
        <h3 class="post-title"><a href="post.html?id=${post.id}">${
    post.title
  }</a></h3>
        <p class="post-content-text">${post.content}</p>
        <div class="post-meta">
          <span class="category">${post.category_name || "Autres"}</span>
          <span class="likes">❤️ ${post.total_votes || 0}</span>
          <span class="replies">💬 ${post.reply_count || 0}</span>
          <span class="date">📅 ${new Date(
            post.created_at
          ).toLocaleDateString()}</span>
        </div>
        <div class="post-details">
          <span>Par: ${post.username}</span>
        </div>
        ${actionsHtml}
      </div>
    </div>
  `;
}

// ==================== POST ACTIONS ====================

/**
 * Handle post creation
 * @param {Event} e - Form submit event
 */
async function handleCreatePost(e) {
  e.preventDefault();

  if (!postsState.currentUser) {
    showError("Vous devez être connecté pour créer un post.");
    return;
  }

  const formData = getFormData("create-post-form");
  const submitButton = document.querySelector(
    "#create-post-form button[type='submit']"
  );

  showLoading(submitButton, "Publication...");

  const postData = {
    title: formData.title,
    content: formData.content,
    userId: postsState.currentUser.id,
    categoryId: formData.category,
  };

  const result = await safeApiCall(
    () => createPost(postData),
    "création du post"
  );

  hideLoading(submitButton);

  if (result.success) {
    resetForm("create-post-form");
    await loadPosts(); // Reload posts to show new one
    showError("Post créé avec succès !", "post-message");
  } else {
    showError(result.message, "post-message");
  }
}

/**
 * Delete a post
 * @param {number} postId - Post ID
 */
window.deletePostHandler = async function (postId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;

  const result = await safeApiCall(
    () => deletePost(postId),
    "suppression du post"
  );

  if (result.success) {
    await loadPosts();
  } else {
    showError(result.message);
  }
};

// ==================== VOTING ====================

/**
 * Load votes for a post
 * @param {number} postId - Post ID
 * @param {number} userId - User ID
 * @returns {Object} Vote data
 */
async function loadVotesForPost(postId, userId) {
  const result = await safeApiCall(
    () => fetchVotes(postId, userId),
    "chargement des votes"
  );

  return result.success ? result : { totalVotes: 0, userVote: 0 };
}

/**
 * Setup voting functionality for a post
 * @param {HTMLElement} postElement - Post element
 * @param {number} postId - Post ID
 */
function setupPostVoting(postElement, postId) {
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
async function handleVote(postId, voteType, postElement) {
  if (!postsState.currentUser) return;

  const result = await safeApiCall(
    () => submitVote(postId, voteType, postsState.currentUser.id),
    "enregistrement du vote"
  );

  if (result.success) {
    // Update vote display
    const voteCount = postElement.querySelector(".vote-count");
    const upvoteBtn = postElement.querySelector(".upvote-button");
    const downvoteBtn = postElement.querySelector(".downvote-button");

    if (voteCount) voteCount.textContent = result.totalVotes;

    // Update button states
    upvoteBtn.classList.toggle("upvoted", result.userVote === 1);
    downvoteBtn.classList.toggle("downvoted", result.userVote === -1);
  }
}

// ==================== EVENT LISTENERS ====================

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Filter form
  const filterForm = document.getElementById("filter-form");
  if (filterForm) {
    filterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = getFormData(filterForm);
      await updateFilters(formData);
    });
  }

  // Reset filters
  const resetBtn = document.getElementById("reset-filters-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      resetForm("filter-form");
      await updateFilters({ category: "", sortBy: "date", order: "desc" });
    });
  }

  // Category filter change
  const categorySelect = document.getElementById("category-filter-select");
  if (categorySelect) {
    categorySelect.addEventListener("change", async () => {
      await updateFilters({ category: categorySelect.value });
    });
  }

  // Create post form
  setTimeout(() => {
    const createForm = document.getElementById("create-post-form");
    if (createForm) {
      createForm.addEventListener("submit", handleCreatePost);
    }
  }, 100);
}

/**
 * Setup UI based on authentication state
 */
function setupUI() {
  const createPostContainer = document.getElementById("create-post-container");

  if (createPostContainer) {
    if (!postsState.currentUser) {
      createPostContainer.innerHTML =
        '<p>Vous devez être <a href="login.html">connecté</a> pour créer un post.</p>';
    } else {
      createPostContainer.innerHTML = createPostFormHTML();
    }
  }
}

/**
 * Generate create post form HTML
 * @returns {string} HTML string
 */
function createPostFormHTML() {
  return `
    <h3>Créer un nouveau post</h3>
    <form id="create-post-form">
      <div>
        <label for="category">Catégorie :</label>
        <select id="category" name="category" required>
          <option value="">Chargement des catégories...</option>
        </select>
      </div>
      <div>
        <label for="title">Titre :</label>
        <input type="text" id="title" name="title" required />
      </div>
      <div>
        <label for="content">Contenu :</label>
        <textarea id="content" name="content" rows="4" required></textarea>
      </div>
      <button type="submit">Publier</button>
    </form>
    <div id="post-message"></div>
  `;
}

// ==================== EXPORTS ====================

export { updateFilters, loadPosts };
