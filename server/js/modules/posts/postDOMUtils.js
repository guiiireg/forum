/**
 * Gets form data from post creation form
 * @returns {Object} Form data containing title, content, categoryId
 */
export function getPostFormData() {
  const categorySelect = document.getElementById("category");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");

  return {
    categoryId: categorySelect?.value || "",
    title: titleInput?.value || "",
    content: contentInput?.value || "",
  };
}

/**
 * Gets form data from post edit form
 * @param {number} postId - ID of the post being edited (optional, uses generic IDs if not provided)
 * @returns {Object} Form data containing title, content, categoryId
 */
export function getEditFormData(postId = null) {
  const suffix = postId ? `-${postId}` : "";

  const titleInput = document.getElementById(`edit-title${suffix}`);
  const contentInput = document.getElementById(`edit-content${suffix}`);
  const categoryInput = document.getElementById(`edit-category${suffix}`);

  return {
    title: titleInput?.value || "",
    content: contentInput?.value || "",
    categoryId: categoryInput?.value || "",
  };
}

/**
 * Clears the post creation form
 */
export function clearPostForm() {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const categorySelect = document.getElementById("category");

  if (titleInput) titleInput.value = "";
  if (contentInput) contentInput.value = "";
  if (categorySelect) categorySelect.value = "";
}

/**
 * Shows/hides elements during edit mode
 * @param {HTMLElement} postElement - The post DOM element
 * @param {boolean} isEditing - Whether to show edit mode or normal mode
 */
export function toggleEditMode(postElement, isEditing) {
  const titleElement = postElement.querySelector(".post-title");
  const contentElement = postElement.querySelector(".post-content-text");
  const actionsElement = postElement.querySelector(".post-actions");
  const editForm = postElement.querySelector(".edit-form");

  if (isEditing) {
    // Hide normal elements
    if (titleElement) titleElement.style.display = "none";
    if (contentElement) contentElement.style.display = "none";
    if (actionsElement) actionsElement.style.display = "none";
  } else {
    // Show normal elements and remove edit form
    if (titleElement) titleElement.style.display = "";
    if (contentElement) contentElement.style.display = "";
    if (actionsElement) actionsElement.style.display = "";
    if (editForm) editForm.remove();
  }
}

/**
 * Populates category select options
 * @param {string} selectId - ID of the select element
 * @param {Array} categories - Array of category objects
 * @param {string} defaultOption - Default option text
 */
export function populateCategorySelect(
  selectId,
  categories,
  defaultOption = "Sélectionnez une catégorie"
) {
  const selectElement = document.getElementById(selectId);
  if (!selectElement) return;

  selectElement.innerHTML = `<option value="">${defaultOption}</option>`;

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    selectElement.appendChild(option);
  });
}

/**
 * Creates and returns a new post DOM element
 * @param {string} htmlContent - HTML content for the post
 * @returns {HTMLElement} New post element
 */
export function createPostElement(htmlContent) {
  const postElement = document.createElement("div");
  postElement.innerHTML = htmlContent;
  return postElement;
}

/**
 * Finds and returns a post element by ID
 * @param {number} postId - ID of the post
 * @returns {HTMLElement|null} Post element or null if not found
 */
export function findPostElement(postId) {
  return document.querySelector(`#post-${postId}`);
}

/**
 * Removes a post element from the DOM
 * @param {number} postId - ID of the post to remove
 */
export function removePostElement(postId) {
  const postElement = findPostElement(postId);
  if (postElement) {
    postElement.remove();
  }
}

/**
 * Shows error message to user
 * @param {string} message - Error message to display
 */
export function showError(message) {
  // Using alert for now, can be replaced with a more sophisticated notification system
  alert(message);
}

/**
 * Shows success message to user
 * @param {string} message - Success message to display
 */
export function showSuccess(message) {
  // Using alert for now, can be replaced with a more sophisticated notification system
  alert(message);
}
