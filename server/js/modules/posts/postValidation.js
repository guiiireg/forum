/**
 * Validates post data (title and content)
 * @param {string} title - Post title
 * @param {string} content - Post content
 * @returns {Object} Validation result with isValid and errors
 */
export function validatePostData(title, content) {
  const errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push("Le titre est requis.");
  }
  
  if (!content || content.trim().length === 0) {
    errors.push("Le contenu est requis.");
  }
  
  if (title && title.trim().length > 255) {
    errors.push("Le titre ne peut pas dépasser 255 caractères.");
  }
  
  if (content && content.trim().length > 10000) {
    errors.push("Le contenu ne peut pas dépasser 10000 caractères.");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates category selection
 * @param {string|number} categoryId - Selected category ID
 * @returns {Object} Validation result with isValid and error message
 */
export function validateCategory(categoryId) {
  if (!categoryId || categoryId === "") {
    return {
      isValid: false,
      error: "Veuillez sélectionner une catégorie."
    };
  }
  
  return {
    isValid: true,
    error: null
  };
}

/**
 * Validates user authentication for post operations
 * @param {string|number} userId - User ID
 * @returns {Object} Validation result with isValid and error message
 */
export function validateUserAuth(userId) {
  if (!userId) {
    return {
      isValid: false,
      error: "Vous devez être connecté pour effectuer cette action."
    };
  }
  
  return {
    isValid: true,
    error: null
  };
}

/**
 * Validates complete post form data
 * @param {Object} formData - Form data containing title, content, categoryId
 * @param {string|number} userId - User ID
 * @returns {Object} Complete validation result
 */
export function validatePostForm(formData, userId) {
  const { title, content, categoryId } = formData;
  
  const userValidation = validateUserAuth(userId);
  if (!userValidation.isValid) {
    return userValidation;
  }
  
  const postValidation = validatePostData(title, content);
  if (!postValidation.isValid) {
    return {
      isValid: false,
      error: postValidation.errors.join(" ")
    };
  }
  
  const categoryValidation = validateCategory(categoryId);
  if (!categoryValidation.isValid) {
    return categoryValidation;
  }
  
  return {
    isValid: true,
    error: null
  };
}

/**
 * Sanitizes input text by trimming whitespace
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') {
    return '';
  }
  return text.trim();
} 