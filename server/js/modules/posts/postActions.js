import { fetchCategories, createPost, updatePost, deletePost } from './postApi.js';
import { validatePostForm, sanitizeText } from './postValidation.js';
import { showError, showSuccess, getPostFormData, getEditFormData, clearPostForm, toggleEditMode, findPostElement } from './postDOMUtils.js';
import { createEditForm } from './postsUI.js';

/**
 * Handles the edit post action by showing the edit form
 * @param {HTMLElement} postElement - The post DOM element
 * @returns {Promise<void>}
 */
export async function handleEditPost(postElement) {
  const titleElement = postElement.querySelector("h2, .post-title");
  const contentElement = postElement.querySelector("p, .post-content-text");
  
  if (!titleElement || !contentElement) {
    showError("Impossible de trouver les éléments du post à modifier.");
    return;
  }

  const currentTitle = titleElement.textContent;
  const currentContent = contentElement.textContent;

  try {
    const categoriesData = await fetchCategories();
    
    if (!categoriesData.success) {
      showError("Erreur lors du chargement des catégories.");
      return;
    }

    let categoriesOptions = '<option value="">Sélectionnez une catégorie</option>';
    categoriesData.categories.forEach((category) => {
      categoriesOptions += `<option value="${category.id}">${category.name}</option>`;
    });

    const postId = postElement.id.replace('post-', '');
    const editFormHTML = createEditForm(postId, currentTitle, currentContent, categoriesOptions);
    
    const editForm = document.createElement("div");
    editForm.innerHTML = editFormHTML;
    
    toggleEditMode(postElement, true);
    postElement.appendChild(editForm);
    
  } catch (error) {
    console.error("Error in handleEditPost:", error);
    showError("Une erreur est survenue lors de l'initialisation de l'édition.");
  }
}

/**
 * Saves the edited post
 * @param {number} postId - ID of the post to save
 * @param {number} userId - ID of the user making the edit
 * @returns {Promise<boolean>} Success status
 */
export async function saveEditPost(postId, userId) {
  try {
    const formData = getEditFormData(postId);
    
    // Sanitize input data
    const sanitizedData = {
      title: sanitizeText(formData.title),
      content: sanitizeText(formData.content),
      categoryId: formData.categoryId
    };

    // Validate the form data
    const validation = validatePostForm(sanitizedData, userId);
    if (!validation.isValid) {
      showError(validation.error);
      return false;
    }

    const postData = {
      title: sanitizedData.title,
      content: sanitizedData.content,
      userId: parseInt(userId),
      categoryId: parseInt(sanitizedData.categoryId),
    };

    const response = await updatePost(postId, postData);

    if (response.success) {
      showSuccess(response.message);
      return true;
    } else {
      showError(response.message);
      return false;
    }
  } catch (error) {
    console.error("Error in saveEditPost:", error);
    showError("Une erreur est survenue lors de la modification.");
    return false;
  }
}

/**
 * Handles post deletion with confirmation
 * @param {number} postId - ID of the post to delete
 * @param {number} userId - ID of the user requesting deletion
 * @returns {Promise<boolean>} Success status
 */
export async function handleDeletePost(postId, userId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
    return false;
  }

  try {
    const response = await deletePost(postId, userId);

    if (response.success) {
      showSuccess(response.message);
      return true;
    } else {
      showError(response.message);
      return false;
    }
  } catch (error) {
    console.error("Error in handleDeletePost:", error);
    showError("Une erreur est survenue lors de la suppression.");
    return false;
  }
}

/**
 * Handles post creation
 * @param {number} userId - ID of the user creating the post
 * @returns {Promise<boolean>} Success status
 */
export async function handleCreatePost(userId) {
  try {
    const formData = getPostFormData();
    
    // Sanitize input data
    const sanitizedData = {
      title: sanitizeText(formData.title),
      content: sanitizeText(formData.content),
      categoryId: formData.categoryId
    };

    // Validate the form data
    const validation = validatePostForm(sanitizedData, userId);
    if (!validation.isValid) {
      showError(validation.error);
      return false;
    }

    const postData = {
      title: sanitizedData.title,
      content: sanitizedData.content,
      userId: parseInt(userId),
      categoryId: parseInt(sanitizedData.categoryId),
    };

    const response = await createPost(postData);

    if (response.success) {
      showSuccess(response.message);
      clearPostForm();
      return true;
    } else {
      showError(response.message);
      return false;
    }
  } catch (error) {
    console.error("Error in handleCreatePost:", error);
    showError("Une erreur est survenue lors de la création du post.");
    return false;
  }
}

/**
 * Cancels post editing and returns to normal view
 * @param {number} postId - ID of the post being edited
 */
export function cancelEditPost(postId) {
  const postElement = findPostElement(postId);
  if (postElement) {
    toggleEditMode(postElement, false);
  }
}


