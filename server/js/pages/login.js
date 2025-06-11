/**
 * Login Page - Entry point for the login page
 */

import { initAuth, showWelcomeMessage } from "../core/auth.js";

/**
 * Initialize the login page
 */
function initLoginPage() {
  initAuth();

  showWelcomeMessage();
}

document.addEventListener("DOMContentLoaded", initLoginPage);
