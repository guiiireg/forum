/**
 * Register Page - JavaScript functionality for the registration page
 */

import { initAuth } from "../core/auth.js";
import { initSidebarToggle } from "../core/dom.js";

/**
 * Initialize register form validation
 */
function initRegisterFormValidation() {
  const registerForm = document.getElementById("register-form");
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");
  const passwordField = document.getElementById("password");
  const confirmPasswordField = document.getElementById("confirm-password");
  const usernameField = document.getElementById("username");

  if (!registerForm || !errorMessage) return;

  registerForm.addEventListener("submit", (e) => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const termsAccepted = document.getElementById("terms").checked;

    // Clear previous messages
    clearMessages();

    // Validation
    if (!username || !password || !confirmPassword) {
      e.preventDefault();
      showError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (username.length < 3) {
      e.preventDefault();
      showError("Le nom d'utilisateur doit contenir au moins 3 caractères.");
      return;
    }

    if (username.length > 20) {
      e.preventDefault();
      showError("Le nom d'utilisateur ne peut pas dépasser 20 caractères.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      e.preventDefault();
      showError("Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores.");
      return;
    }

    if (password.length < 6) {
      e.preventDefault();
      showError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      e.preventDefault();
      showError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!termsAccepted) {
      e.preventDefault();
      showError("Vous devez accepter les conditions d'utilisation.");
      return;
    }
  });

  // Real-time password confirmation check
  if (confirmPasswordField && passwordField) {
    confirmPasswordField.addEventListener("input", () => {
      if (confirmPasswordField.value && passwordField.value !== confirmPasswordField.value) {
        confirmPasswordField.style.borderColor = "var(--error-color)";
      } else {
        confirmPasswordField.style.borderColor = "var(--border-color)";
      }
    });
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.className = "message-container error";
    errorMessage.style.display = "block";
    if (successMessage) {
      successMessage.style.display = "none";
    }
  }

  function showSuccess(message) {
    if (successMessage) {
      successMessage.textContent = message;
      successMessage.className = "message-container success";
      successMessage.style.display = "block";
    }
    errorMessage.style.display = "none";
  }

  function clearMessages() {
    errorMessage.style.display = "none";
    if (successMessage) {
      successMessage.style.display = "none";
    }
  }

  // Auto-focus on username field
  if (usernameField) {
    usernameField.focus();
  }
}

/**
 * Initialize the register page
 */
function initRegisterPage() {
  initAuth();
  initSidebarToggle();
  initRegisterFormValidation();
}

document.addEventListener("DOMContentLoaded", initRegisterPage); 