import { handleRegistration } from './handleRegistration.js';
import { handleLogin } from './handleLogin.js';

/**
 * Initialize the app
 */
export function initializeApp() {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegistration);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}
