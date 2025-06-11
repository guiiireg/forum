import { initializeApp } from "./initializeApp.js";
import { checkAuth, updateAuthUI } from "./auth/index.js";

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  updateAuthUI();
  initializeApp();
});
