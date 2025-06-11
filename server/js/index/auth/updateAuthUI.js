import { isAuthenticated } from "./isAuthenticated.js";

/**
 * Update the UI based on authentication status
 */
export function updateAuthUI() {
  const logoutLink = document.getElementById("logout-link");
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");

  if (isAuthenticated()) {
    if (logoutLink) logoutLink.style.display = "block";
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";

    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        window.location.href = "/login.html";
      });
    }
  } else {
    if (logoutLink) logoutLink.style.display = "none";
    if (loginLink) loginLink.style.display = "block";
    if (registerLink) registerLink.style.display = "block";
  }
}
