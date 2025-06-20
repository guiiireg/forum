import { initAuth, showWelcomeMessage } from "../core/auth.js";
import { initSidebarToggle } from "../core/dom.js";

function initLoginFormValidation() {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");
  const usernameField = document.getElementById("username");

  if (!loginForm || !errorMessage) return;

  loginForm.addEventListener("submit", (e) => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      e.preventDefault();
      showError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (username.length < 3) {
      e.preventDefault();
      showError("Le nom d'utilisateur doit contenir au moins 3 caractères.");
      return;
    }

    if (password.length < 6) {
      e.preventDefault();
      showError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    clearError();
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.className = "message-container error";
    errorMessage.style.display = "block";
  }

  function clearError() {
    errorMessage.style.display = "none";
  }

  if (usernameField) {
    usernameField.focus();
  }
}

function initLoginPage() {
  initAuth();
  initSidebarToggle();
  initLoginFormValidation();
  showWelcomeMessage();
}

document.addEventListener("DOMContentLoaded", initLoginPage);
