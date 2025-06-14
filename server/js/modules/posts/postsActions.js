import {
  createPost,
  updatePost,
  deletePost,
  safeApiCall,
} from "../../lib/api.js";
import {
  getFormData,
  resetForm,
  showError,
  showLoading,
  hideLoading,
  populateSelect,
} from "../../lib/dom.js";
import {
  getCurrentUser,
  getCurrentCategories,
  loadCategories,
} from "./postsState.js";

/**
 * Handle post creation
 * @param {Event} e - Form submit event
 * @param {Function} onSuccess - Success callback
 */
export async function handleCreatePost(e, onSuccess) {
  e.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser) {
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
    userId: parseInt(currentUser.id),
    categoryId: formData.category ? parseInt(formData.category) : null,
  };

  const result = await safeApiCall(
    () => createPost(postData),
    "création du post"
  );

  hideLoading(submitButton);

  if (result.success) {
    resetForm("create-post-form");
    if (onSuccess) await onSuccess();
    showError("Post créé avec succès !", "post-message");
  } else {
    showError(result.message, "post-message");
  }
}

/**
 * Edit a post
 * @param {number} postId - Post ID
 * @param {Array} posts - Current posts array
 */
export async function editPost(postId, posts) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showError("Vous devez être connecté pour modifier un post.");
    return;
  }

  const post = posts.find((p) => p.id === postId);
  if (!post) {
    showError("Post non trouvé.");
    return;
  }

  if (parseInt(currentUser.id) !== post.user_id) {
    showError("Vous n'êtes pas autorisé à modifier ce post.");
    return;
  }

  showEditModal(post);
}

/**
 * Show edit modal for a post
 * @param {Object} post - Post to edit
 */
function showEditModal(post) {
  const existingModal = document.getElementById("edit-modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modalHTML = generateEditModalHTML(post);
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  setTimeout(() => populateEditCategories(post.category_id), 0);

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
 * Generate edit modal HTML
 * @param {Object} post - Post data
 * @returns {string} HTML string
 */
function generateEditModalHTML(post) {
  return `
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
}

/**
 * Close edit modal
 */
export function closeEditModal() {
  const modal = document.getElementById("edit-modal");
  if (modal) {
    document.removeEventListener("keydown", closeOnEscape);
    modal.remove();
  }
}

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
  if (!categorySelect) return;

  try {
    let categories = getCurrentCategories();
    if (!categories || categories.length === 0) {
      await loadCategories();
      categories = getCurrentCategories();
    }

    categorySelect.innerHTML =
      '<option value="">Sélectionner une catégorie...</option>';

    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        if (category.id == selectedCategoryId) {
          option.selected = true;
        }
        categorySelect.appendChild(option);
      });
    } else {
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
  const currentUser = getCurrentUser();

  showLoading(submitButton, "Sauvegarde...");

  const postData = {
    title: formData.title,
    content: formData.content,
    userId: parseInt(currentUser.id),
    categoryId: formData.category ? parseInt(formData.category) : null,
  };

  const result = await safeApiCall(
    () => updatePost(parseInt(postId), postData),
    "modification du post"
  );

  hideLoading(submitButton);

  if (result.success) {
    closeEditModal();
    window.location.reload(); // Reload to refresh posts
    showError("Post modifié avec succès !", "post-message");
  } else {
    showError(result.message, "edit-message");
  }
}

/**
 * Delete a post
 * @param {number} postId - Post ID
 * @param {Function} onSuccess - Success callback
 */
export async function deletePostHandler(postId, onSuccess) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showError("Vous devez être connecté pour supprimer un post.");
    return;
  }

  const result = await safeApiCall(
    () => deletePost(parseInt(postId), parseInt(currentUser.id)),
    "suppression du post"
  );

  if (result.success) {
    if (onSuccess) await onSuccess();
    showError("Post supprimé avec succès !", "post-message");
  } else {
    showError(result.message);
  }
}

window.editPost = editPost;
window.closeEditModal = closeEditModal;
window.deletePostHandler = deletePostHandler;
