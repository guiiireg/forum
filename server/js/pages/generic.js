/**
 * Generic Page - Simple initialization for basic pages
 */

import { initAuth } from "../lib/auth.js";

/**
 * Initialize basic authentication and UI
 */
function initGenericPage() {
  initAuth();
}

document.addEventListener("DOMContentLoaded", initGenericPage);
