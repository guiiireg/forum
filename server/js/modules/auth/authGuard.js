/**
 * Authentication Guard for handling user authentication checks
 */
export class AuthGuard {
  /**
   * Get current user data from localStorage
   * @returns {Object|null} User data or null if not authenticated
   */
  static getCurrentUser() {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    if (!userId || !username) {
      return null;
    }

    return {
      id: userId,
      username: username,
    };
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  static isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Redirect to login if not authenticated
   * @param {string} redirectUrl - URL to redirect to (default: /login)
   * @returns {boolean} True if user is authenticated, false if redirected
   */
  static requireAuth(redirectUrl = "/login") {
    if (!this.isAuthenticated()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  /**
   * Show authentication required message and hide elements
   * @param {string} elementId - ID of element to modify
   * @param {string} message - Message to show
   */
  static showAuthRequired(
    elementId,
    message = 'Vous devez être <a href="login.html">connecté</a> pour cette action.'
  ) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `<p>${message}</p>`;
    }
  }

  /**
   * Hide form if user is not authenticated
   * @param {string} formId - ID of form to hide
   */
  static hideFormIfNotAuth(formId) {
    if (!this.isAuthenticated()) {
      const form = document.getElementById(formId);
      if (form) {
        form.style.display = "none";
      }
    }
  }

  /**
   * Setup authentication-based UI
   * @param {Object} config - Configuration for auth-based UI
   */
  static setupAuthUI(config = {}) {
    const user = this.getCurrentUser();
    const { containerIds = [], formIds = [], authRequiredMessage } = config;

    if (!user) {
      formIds.forEach((formId) => this.hideFormIfNotAuth(formId));
      containerIds.forEach((containerId) =>
        this.showAuthRequired(containerId, authRequiredMessage)
      );
    }

    return user;
  }
}
