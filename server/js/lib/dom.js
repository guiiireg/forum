/**
 * DOM Utilities Module - Common DOM manipulation functions
 */

// ==================== ELEMENT CREATION ====================

/**
 * Create a DOM element from HTML string
 * @param {string} htmlString - HTML string to convert
 * @returns {HTMLElement} Created DOM element
 */
export function createElementFromHTML(htmlString) {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}

/**
 * Populate a select element with options
 * @param {string} selectId - ID of the select element
 * @param {Array} options - Array of option objects {value, text}
 * @param {string} defaultText - Default option text (optional)
 */
export function populateSelect(selectId, options, defaultText = null) {
  const select = document.getElementById(selectId);
  if (!select) {
    console.error(`Select element ${selectId} not found!`);
    return;
  }

  if (defaultText) {
    select.innerHTML = `<option value="">${defaultText}</option>`;
  } else {
    select.innerHTML = "";
  }

  options.forEach((option, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.value || option.id;
    optionElement.textContent = option.text || option.name;
    select.appendChild(optionElement);
  });
}

// ==================== FORM UTILITIES ====================

/**
 * Get form data as an object
 * @param {string|HTMLFormElement} form - Form element or ID
 * @returns {Object} Form data as key-value pairs
 */
export function getFormData(form) {
  const formElement =
    typeof form === "string" ? document.getElementById(form) : form;
  if (!formElement) return {};

  const formData = new FormData(formElement);
  const data = {};

  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  return data;
}

/**
 * Reset form and clear error messages
 * @param {string|HTMLFormElement} form - Form element or ID
 */
export function resetForm(form) {
  const formElement =
    typeof form === "string" ? document.getElementById(form) : form;
  if (!formElement) return;

  formElement.reset();

  const errorElements = formElement.querySelectorAll(
    ".error-message, #error-message"
  );
  errorElements.forEach((el) => (el.textContent = ""));
}

// ==================== MESSAGE DISPLAY ====================

/**
 * Show error message
 * @param {string} message - Error message to display
 * @param {string} elementId - ID of element to display message in (default: 'error-message')
 */
export function showError(message, elementId = "error-message") {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = "block";
  }
}

/**
 * Show success message
 * @param {string} message - Success message to display
 * @param {string} elementId - ID of element to display message in (default: 'success-message')
 */
export function showSuccess(message, elementId = "success-message") {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = "block";
  }
}

/**
 * Clear all messages
 * @param {Array} elementIds - Array of element IDs to clear
 */
export function clearMessages(
  elementIds = ["error-message", "success-message"]
) {
  elementIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = "";
      element.style.display = "none";
    }
  });
}

// ==================== LOADING STATES ====================

/**
 * Show loading state for an element
 * @param {string|HTMLElement} element - Element or ID
 * @param {string} loadingText - Text to show while loading
 */
export function showLoading(element, loadingText = "Chargement...") {
  const el =
    typeof element === "string" ? document.getElementById(element) : element;
  if (!el) return;

  el.dataset.originalText = el.textContent;
  el.textContent = loadingText;
  el.disabled = true;
}

/**
 * Hide loading state for an element
 * @param {string|HTMLElement} element - Element or ID
 */
export function hideLoading(element) {
  const el =
    typeof element === "string" ? document.getElementById(element) : element;
  if (!el) return;

  if (el.dataset.originalText) {
    el.textContent = el.dataset.originalText;
    delete el.dataset.originalText;
  }
  el.disabled = false;
}

// ==================== VISIBILITY UTILITIES ====================

/**
 * Toggle element visibility
 * @param {string|HTMLElement} element - Element or ID
 * @param {boolean} show - Whether to show or hide
 */
export function toggleVisibility(element, show) {
  const el =
    typeof element === "string" ? document.getElementById(element) : element;
  if (!el) return;

  el.style.display = show ? "block" : "none";
}

/**
 * Show element
 * @param {string|HTMLElement} element - Element or ID
 */
export function showElement(element) {
  toggleVisibility(element, true);
}

/**
 * Hide element
 * @param {string|HTMLElement} element - Element or ID
 */
export function hideElement(element) {
  toggleVisibility(element, false);
}

// ==================== EVENT UTILITIES ====================

/**
 * Add event listener with automatic cleanup
 * @param {string|HTMLElement} element - Element or ID
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @returns {Function} Cleanup function
 */
export function addEventListenerWithCleanup(element, event, handler) {
  const el =
    typeof element === "string" ? document.getElementById(element) : element;
  if (!el) return () => {};

  el.addEventListener(event, handler);

  return () => {
    el.removeEventListener(event, handler);
  };
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
