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

  await new Promise((resolve) => setTimeout(resolve, 100));

  setupUI();
  await loadCategories();
  await loadPosts();
  setupEventListeners();
}

// ==================== DATA LOADING ====================

/**
 * Load categories and populate selects
 */
async function loadCategories() {
  try {
    const result = await fetchCategories();

    if (result.success && result.categories) {
      postsState.categories = result.categories;

      const categorySelect = document.getElementById("category");
      const filterSelect = document.getElementById("category-filter-select");

      if (categorySelect) {
        populateSelect("category", result.categories);

        categorySelect.style.display = "block";
        categorySelect.style.visibility = "visible";
        categorySelect.style.opacity = "1";
        categorySelect.style.height = "auto";
        categorySelect.style.minHeight = "30px";
        categorySelect.style.backgroundColor = "white";
        categorySelect.style.border = "2px solid red";
      } else {
        console.warn("Element 'category' not found");
      }

      if (filterSelect) {
        populateSelect(
          "category-filter-select",
          result.categories,
          "Toutes les catégories"
        );
      } else {
        console.warn("Element 'category-filter-select' not found");
      }
    } else {
      console.error(
        "Failed to load categories:",
        result.message || "No categories data"
      );
      const selects = ["category", "category-filter-select"];
      selects.forEach((selectId) => {
        const select = document.getElementById(selectId);
        if (select) {
          select.innerHTML = '<option value="">Erreur de chargement</option>';
        }
      });
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    const selects = ["category", "category-filter-select"];
    selects.forEach((selectId) => {
      const select = document.getElementById(selectId);
      if (select) {
        select.innerHTML = '<option value="">Erreur de chargement</option>';
      }
    });
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

  if (filters.category && filters.category !== "") {
    filteredPosts = filteredPosts.filter(
      (post) => post.category_id == filters.category
    );
  }

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
    userId: parseInt(postsState.currentUser.id),
    categoryId: formData.category ? parseInt(formData.category) : null,
  };

  const result = await safeApiCall(
    () => createPost(postData),
    "création du post"
  );

  hideLoading(submitButton);

  if (result.success) {
    resetForm("create-post-form");
    await loadPosts();
    showError("Post créé avec succès !", "post-message");
  } else {
    showError(result.message, "post-message");
  }
}

/**
 * Edit a post
 * @param {number} postId - Post ID
 */
window.editPost = async function (postId) {
  if (!postsState.currentUser) {
    showError("Vous devez être connecté pour modifier un post.");
    return;
  }

  const post = postsState.posts.find((p) => p.id === postId);
  if (!post) {
    showError("Post non trouvé.");
    return;
  }

  if (parseInt(postsState.currentUser.id) !== post.user_id) {
    showError("Vous n'êtes pas autorisé à modifier ce post.");
    return;
  }

  showEditModal(post);
};

/**
 * Show edit modal for a post
 * @param {Object} post - Post to edit
 */
function showEditModal(post) {
  const existingModal = document.getElementById("edit-modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modalHTML = `
    <div id="edit-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Modifier le post</h3>
          <span class="close" onclick="closeEditModal()">&times;</span>
        </div>
        <form id="edit-post-form">
          <div class="form-group">
            <label for="edit-category">Catégorie :</label>
            <select id="edit-category" name="category" required>
              <option value="">Chargement des catégories...</option>
            </select>
          </div>
          <div class="form-group">
            <label for="edit-title">Titre :</label>
            <input type="text" id="edit-title" name="title" value="${post.title}" required />
          </div>
          <div class="form-group">
            <label for="edit-content">Contenu :</label>
            <textarea id="edit-content" name="content" rows="6" required>${post.content}</textarea>
          </div>
          <div class="form-actions">
            <button type="button" onclick="closeEditModal()" class="cancel-btn">Annuler</button>
            <button type="submit" class="save-btn">Sauvegarder</button>
          </div>
        </form>
        <div id="edit-message"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  setTimeout(() => {
    populateEditCategories(post.category_id);
  }, 0);

  const editForm = document.getElementById("edit-post-form");
  editForm.addEventListener("submit", (e) => handleEditPost(e, post.id));

  const modal = document.getElementById("edit-modal");
  modal.style.display = "block";

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeEditModal();
    }
  });

  document.addEventListener("keydown", closeOnEscape);
}

/**
 * Close edit modal
 */
window.closeEditModal = function () {
  const modal = document.getElementById("edit-modal");
  if (modal) {
    document.removeEventListener("keydown", closeOnEscape);
    modal.remove();
  }
};

/**
 * Handle escape key to close modal
 * @param {KeyboardEvent} e - Keyboard event
 */
function closeOnEscape(e) {
  if (e.key === "Escape") {
    const modal = document.getElementById("edit-modal");
    if (modal && modal.style.display === "block") {
      closeEditModal();
    }
  }
}

/**
 * Populate categories in edit form
 * @param {number} selectedCategoryId - Currently selected category ID
 */
async function populateEditCategories(selectedCategoryId) {
  const categorySelect = document.getElementById("edit-category");
  if (!categorySelect) {
    console.error("Edit category select not found!");
    return;
  }

  try {
    if (!postsState.categories || postsState.categories.length === 0) {
      console.log("Categories not loaded, fetching them...");
      await loadCategories();
    }

    categorySelect.innerHTML =
      '<option value="">Sélectionner une catégorie...</option>';

    if (postsState.categories && postsState.categories.length > 0) {
      postsState.categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;

        if (category.id == selectedCategoryId) {
          option.selected = true;
        }

        categorySelect.appendChild(option);
      });
      console.log(
        `Loaded ${postsState.categories.length} categories in edit form`
      );
    } else {
      console.error("No categories available to populate");
      categorySelect.innerHTML =
        '<option value="">Aucune catégorie disponible</option>';
    }
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
    categorySelect.innerHTML = '<option value="">Erreur de chargement</option>';
  }
}

/**
 * Handle edit post form submission
 * @param {Event} e - Form submit event
 * @param {number} postId - Post ID to edit
 */
async function handleEditPost(e, postId) {
  e.preventDefault();

  const formData = getFormData("edit-post-form");
  const submitButton = document.querySelector("#edit-post-form .save-btn");

  showLoading(submitButton, "Sauvegarde...");

  const postData = {
    title: formData.title,
    content: formData.content,
    userId: parseInt(postsState.currentUser.id),
    categoryId: formData.category ? parseInt(formData.category) : null,
  };

  const result = await safeApiCall(
    () => updatePost(parseInt(postId), postData),
    "modification du post"
  );

  hideLoading(submitButton);

  if (result.success) {
    closeEditModal();
    await loadPosts();
    showError("Post modifié avec succès !", "post-message");
  } else {
    showError(result.message, "edit-message");
  }
}

/**
 * Delete a post
 * @param {number} postId - Post ID
 */
window.deletePostHandler = async function (postId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;

  if (!postsState.currentUser) {
    showError("Vous devez être connecté pour supprimer un post.");
    return;
  }

  const result = await safeApiCall(
    () => deletePost(parseInt(postId), parseInt(postsState.currentUser.id)),
    "suppression du post"
  );

  if (result.success) {
    await loadPosts();
    showError("Post supprimé avec succès !", "post-message");
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
    () =>
      submitVote(
        parseInt(postId),
        parseInt(voteType),
        parseInt(postsState.currentUser.id)
      ),
    "enregistrement du vote"
  );

  if (result.success) {
    const voteCount = postElement.querySelector(".vote-count");
    const upvoteBtn = postElement.querySelector(".upvote-button");
    const downvoteBtn = postElement.querySelector(".downvote-button");
    const likesSpan = postElement.querySelector(".likes");

    if (voteCount) {
      voteCount.textContent = result.votes.totalVotes || 0;
    }

    if (upvoteBtn) {
      upvoteBtn.classList.toggle("upvoted", result.votes.userVote === 1);
      upvoteBtn.classList.toggle("not-voted", result.votes.userVote !== 1);
    }
    if (downvoteBtn) {
      downvoteBtn.classList.toggle("downvoted", result.votes.userVote === -1);
      downvoteBtn.classList.toggle("not-voted", result.votes.userVote !== -1);
    }

    if (likesSpan) {
      likesSpan.textContent = `❤️ ${result.votes.totalVotes || 0}`;
    }
  }
}

// ==================== EVENT LISTENERS ====================

/**
 * Setup event listeners
 */
function setupEventListeners() {
  const filterForm = document.getElementById("filter-form");
  if (filterForm) {
    filterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = getFormData(filterForm);
      await updateFilters(formData);
    });
  }

  const resetBtn = document.getElementById("reset-filters-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      resetForm("filter-form");
      await updateFilters({ category: "", sortBy: "date", order: "desc" });
    });
  }

  const categorySelect = document.getElementById("category-filter-select");
  if (categorySelect) {
    categorySelect.addEventListener("change", async () => {
      await updateFilters({ category: categorySelect.value });
    });
  }

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
