import { initAuth } from "../core/auth.js";

function initGenericPage() {
  initAuth();
}

document.addEventListener("DOMContentLoaded", initGenericPage);
