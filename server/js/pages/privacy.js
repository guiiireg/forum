import { initAuth } from "../core/auth.js";

function initPrivacyPage() {
  initAuth();

  const lastUpdateElement = document.getElementById("last-update");
  if (lastUpdateElement) {
    lastUpdateElement.textContent = new Date().toLocaleDateString("fr-FR");
  }
}

document.addEventListener("DOMContentLoaded", initPrivacyPage);
