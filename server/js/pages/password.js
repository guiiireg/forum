/**
 * Password Reset Page - JavaScript functionality for the password reset page
 */

import { initAuth } from "../core/auth.js";
import { initSidebarToggle } from "../core/dom.js";

/**
 * Initialize password reset form validation
 */
function initPasswordResetFormValidation() {
  const resetForm = document.getElementById('reset-password-form');
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');
  const newPasswordField = document.getElementById('new-password');
  const confirmNewPasswordField = document.getElementById('confirm-new-password');
  const usernameField = document.getElementById('username');

  if (!resetForm || !errorMessage) return;

  resetForm.addEventListener('submit', (e) => {
    const username = document.getElementById('username').value.trim();
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;

    // Clear previous messages
    clearMessages();

    // Validation
    if (!username || !newPassword || !confirmNewPassword) {
      e.preventDefault();
      showError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (username.length < 3) {
      e.preventDefault();
      showError('Le nom d\'utilisateur doit contenir au moins 3 caractères.');
      return;
    }

    if (newPassword.length < 6) {
      e.preventDefault();
      showError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      e.preventDefault();
      showError('Les mots de passe ne correspondent pas.');
      return;
    }
  });

  // Real-time password confirmation check
  if (confirmNewPasswordField && newPasswordField) {
    confirmNewPasswordField.addEventListener('input', () => {
      if (confirmNewPasswordField.value && newPasswordField.value !== confirmNewPasswordField.value) {
        confirmNewPasswordField.style.borderColor = 'var(--error-color)';
      } else {
        confirmNewPasswordField.style.borderColor = 'var(--border-color)';
      }
    });
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.className = 'message-container error';
    errorMessage.style.display = 'block';
    if (successMessage) {
      successMessage.style.display = 'none';
    }
  }

  function showSuccess(message) {
    if (successMessage) {
      successMessage.textContent = message;
      successMessage.className = 'message-container success';
      successMessage.style.display = 'block';
    }
    errorMessage.style.display = 'none';
  }

  function clearMessages() {
    errorMessage.style.display = 'none';
    if (successMessage) {
      successMessage.style.display = 'none';
    }
  }

  // Auto-focus on username field
  if (usernameField) {
    usernameField.focus();
  }
}

/**
 * Initialize the password reset page
 */
function initPasswordResetPage() {
  initAuth();
  initSidebarToggle();
  initPasswordResetFormValidation();
}

document.addEventListener("DOMContentLoaded", initPasswordResetPage); 