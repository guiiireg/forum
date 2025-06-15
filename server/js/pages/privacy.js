/**
 * Privacy Page - JavaScript functionality for the privacy policy page
 */

import { initAuth } from "../core/auth.js";

/**
 * Initialize privacy page specific functionality
 */
function initPrivacyPage() {
  initAuth();
  
  // Set the last update date
  const lastUpdateElement = document.getElementById("last-update");
  if (lastUpdateElement) {
    lastUpdateElement.textContent = new Date().toLocaleDateString("fr-FR");
  }
}

document.addEventListener("DOMContentLoaded", initPrivacyPage); 